import { formateLog } from "./utils";

type AIModelOptionsMap = {
    languageModel: AIAssistantCreateOptions;
    rewriter: AIRewriterCreateOptions;
    summarizer: AISummarizerCreateOptions;
    writer: AIWriterCreateOptions;
};

type AIModelTaskOptionsMap = {
    languageModel: AIAssistantPromptOptions;
    rewriter: AIRewriterRewriteOptions;
    summarizer: AISummarizerSummarizeOptions;
    writer: AIWriterWriteOptions;
};

type AIModelInstanceMap = {
    languageModel: AIAssistant;
    rewriter: AIRewriter;
    summarizer: AISummarizer;
    writer: AIWriter;
};

type SessionOptions<T extends AIModel> = T extends keyof AIModelOptionsMap ? AIModelOptionsMap[T] : AIAssistantCreateOptions;
type TaskOptions<T extends AIModel> = T extends keyof AIModelTaskOptionsMap ? AIModelTaskOptionsMap[T] : AIAssistantPromptOptions;
type AIInstance<T extends AIModel> = T extends keyof AIModelInstanceMap ? AIModelInstanceMap[T] : AIAssistant;

interface UseChromeAiOptions<T extends AIModel> {
    // 要使用的模型
    model: T
    // 是否使用数据流方式 （默认为 true: 流式输出）
    async?: boolean
    onDataUpdate?: (data: string) => void
    onCompleted?: () => void
    onError?: (error: any) => void
    // 会话参数
    sessionOptions?: SessionOptions<T>
    // 任务参数
    taskOptions?: TaskOptions<T>
}
type PromiseFunctionKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never
}[keyof T];


function _getTaskKey<T extends AIModel>(mode: T, async = true) {
    const taskKeys = {
        languageModel: 'prompt',
        rewriter: 'rewrite',
        summarizer: 'summarize',
        writer: 'write'
    } as const
    return `${async ? taskKeys[mode] + 'Streaming' : taskKeys[mode]}` as PromiseFunctionKeys<AIInstance<T>>

}


export async function chatToChrome<T extends AIModel>(input: string, options: UseChromeAiOptions<T>) {
    const mode = options.model
    formateLog("CHAT", `开始对话，使用模型${mode},输入：${input}`)
    const isAsync = options?.async ?? true
    try {
        const session = await window.ai[mode].create() as any
        // ts写不明白了，先用any了
        const taskKey = _getTaskKey(mode, isAsync)
        if (isAsync) {
            const stream = await session[taskKey](input,
                {
                    ...options?.taskOptions
                }) as ReadableStream<string>
            for await (const chunk of stream) {
                formateLog("CHAT", `流式对话加载，输出：${chunk}`)
                options?.onDataUpdate?.(chunk)
            }
            options?.onCompleted?.()

        } else {
            const res = await session[taskKey](input, {
                ...options?.taskOptions
            }) as string
            formateLog("CHAT", `对话完成，输出：${res}`)
            options?.onDataUpdate?.(res)
            options?.onCompleted?.()
        }

        session.destroy()
    } catch (error) {
        formateLog("CHAT", `对话出错，错误：${error}`)
        options?.onError?.(error)
    }
}