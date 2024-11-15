interface UseChromeAiOptions {
    // 要使用的模型
    mode: keyof typeof window.ai
    // 是否要改成同步数据 （默认为 false: 流式输出）
    sync?: boolean
    onDataUpdate?: (data: string) => void
    // 类型标注有问题，todo 修复
    sessionOptions?: Partial<AISummarizerCreateOptions> & AIWriterCreateOptions & AIAssistantCreateOptions & AIRewriterCreateOptions
}



// function _getTaskCreator(mode: UseChromeAiOptions['mode']) {
//     return {
//         assistant: window.ai.assistant.create,
//         rewriter: window.ai.rewriter.create,
//         summarizer: window.ai.summarizer.create,
//         writer: window.ai.writer.create
//     }[mode]
// }


function _getTask(mode: UseChromeAiOptions['mode'], session: AIAssistant | AISummarizer | AIRewriter | AIWriter, isASync = true) {
    const asyncTasks = new Map();
    asyncTasks.set('assistant', (session as AIAssistant).promptStreaming)
    asyncTasks.set('rewriter', (session as AIRewriter).rewriteStreaming)
    asyncTasks.set('summarizer', (session as AISummarizer).summarizeStreaming)
    asyncTasks.set('writer', (session as AIWriter).writeStreaming)
    const syncTasks = new Map();
    syncTasks.set('assistant', (session as AIAssistant).prompt)
    syncTasks.set('rewriter', (session as AIRewriter).rewrite)
    syncTasks.set('summarizer', (session as AISummarizer).summarize)
    syncTasks.set('writer', (session as AIWriter).write)
    return isASync ? asyncTasks.get(mode) : syncTasks.get(mode)

}



export const useChromeAI = (options?: UseChromeAiOptions) => {
    let session: AIAssistant | AISummarizer | AIRewriter | AIWriter;
    let controller = new AbortController()
    let context = ''

    const isAsync = () => {
        return options?.sync ?? true
    }




    const startTask = async (input: string, taskOptions?: AIAssistantPromptOptions | AIRewriterRewriteOptions | AISummarizerSummarizeOptions | AIWriterWriteOptions) => {
        const mode = options?.mode ?? 'assistant'
        controller = new AbortController()
        // try {
        console.log('mode', mode)
        session = await window.ai[mode].create()
        console.log('session', session)
        const taskFn = _getTask(mode, session, isAsync())
        console.log('taskFn',taskFn)
        if (isAsync()) {
            const res = await taskFn(input, {
                signal: controller.signal,
                ...taskOptions
            }) as string
            options?.onDataUpdate?.(res)
        } else {
            const stream = await taskFn(input,
                {
                    signal: controller.signal,
                    ...taskOptions
                }) as ReadableStream<string>
            for await (const chunk of stream) {
                context = context + chunk
                options?.onDataUpdate?.(context)
            }
        }
        // } catch (e) {
        //     console.warn('[startTask]', e)
        // } finally {
        //     if (session) {
        //         // session.destroy()
        //     }
        // }
    }

    const cancelTask = () => {
        if (controller) {
            controller.abort()
        }
    }


    return {
        startTask,
        cancelTask

    }

}