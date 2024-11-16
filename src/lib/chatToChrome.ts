import { formateLog } from "./utils";

type AIModeOptionsMap = {
    assistant: AIAssistantCreateOptions;
    rewriter: AIRewriterCreateOptions;
    summarizer: AISummarizerCreateOptions;
    writer: AIWriterCreateOptions;
};

type AIModeTaskOptionsMap = {
    assistant: AIAssistantPromptOptions;
    rewriter: AIRewriterRewriteOptions;
    summarizer: AISummarizerSummarizeOptions;
    writer: AIWriterWriteOptions;
};

type AIModeInstanceMap = {
    assistant: AIAssistant;
    rewriter: AIRewriter;
    summarizer: AISummarizer;
    writer: AIWriter;
};

type SessionOptions<T extends AIMode> = T extends keyof AIModeOptionsMap ? AIModeOptionsMap[T] : AIAssistantCreateOptions;
type TaskOptions<T extends AIMode> = T extends keyof AIModeTaskOptionsMap ? AIModeTaskOptionsMap[T] : AIAssistantPromptOptions;
type AIInstance<T extends AIMode> = T extends keyof AIModeInstanceMap ? AIModeInstanceMap[T] : AIAssistant;

interface UseChromeAiOptions<T extends AIMode> {
    // 要使用的模型
    mode: T
    // 是否使用数据流方式 （默认为 true: 流式输出）
    async?: boolean
    onDataUpdate?: (data: string) => void
    onCompleted?: () => void
    // 会话参数
    sessionOptions?: SessionOptions<T>
    // 任务参数
    taskOptions?: TaskOptions<T>
}
type PromiseFunctionKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never
}[keyof T];


function _getTaskKey<T extends AIMode>(mode: T, async = true) {
    const taskKeys = {
        assistant: 'prompt',
        rewriter: 'rewrite',
        summarizer: 'summarize',
        writer: 'write'
    } as const
    return `${async ? taskKeys[mode] + 'Streaming' : taskKeys[mode]}` as PromiseFunctionKeys<AIInstance<T>>

}


export async function chatToChrome<T extends AIMode>(input: string, options: UseChromeAiOptions<T>) {
    const mode = options.mode
    formateLog("CHAT", `开始对话，使用模型${mode},输入：${input}`)
    const isAsync = options?.async ?? true
    const session = await window.ai[mode].create() as any
    // ts写不明白了，先用any了
    const taskKey = _getTaskKey(mode, isAsync)
    if (isAsync) {
        const stream = await session[taskKey](input,
            {
                ...options?.taskOptions
            }) as ReadableStream<string>
        for await (const chunk of stream) {
            formateLog("CHAT", `流式对话记载，输出：${chunk}`)
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
}