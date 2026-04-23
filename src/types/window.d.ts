declare global {

    interface Window {
        // 旧版 Chrome（<138）命名空间。新版 Chrome 已将工厂提升为全局，
        // 参见下面的 LanguageModel / Summarizer / Writer / Rewriter。
        ai?: {
            readonly languageModel: AIAssistantFactory;
            readonly writer: AIWriterFactory;
            readonly rewriter: AIRewriterFactory;
            readonly summarizer: AISummarizerFactory;
        }
    }

    // base
    interface AIBaseOptions {
        signal?: AbortSignal;
    }

    // 旧版（capabilities()）与新版（availability()）返回值
    type AICapabilityAvailability = "readily" | "after-download" | "no"
    // 新版 Chrome built-in AI availability() 返回值
    type AIAvailability = "unavailable" | "downloadable" | "downloading" | "available"
    type AILanguageModelPromptRole = "user" | 'assistant'
    type AILanguageModelInitialPromptRole = "system" | AILanguageModelPromptRole;

    // downloadprogress 事件
    // 新版 Chrome：loaded 为 0..1 的分数，没有 total 字段
    // 旧版 Chrome：{ loaded, total }（字节数）
    interface AIDownloadProgressEvent extends Event {
        readonly loaded: number;
        readonly total?: number;
    }
    interface AICreateMonitor extends EventTarget {
        addEventListener(type: "downloadprogress", listener: (ev: AIDownloadProgressEvent) => void, options?: boolean | AddEventListenerOptions): void;
        removeEventListener(type: "downloadprogress", listener: (ev: AIDownloadProgressEvent) => void, options?: boolean | EventListenerOptions): void;
    }
    type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;

    // AIWriter
    // see more : https://github.com/WICG/writing-assistance-apis?tab=readme-ov-file#summarizer-api

    class AIWriterFactory {
        create(options?: AIWriterCreateOptions): Promise<AIWriter>;
        capabilities(): Promise<AIWriterCapabilities>;
    }

    class AIWriter {
        write(writingTask: string, options?: AIWriterWriteOptions): Promise<string>;
        writeStreaming(writingTask: string, options?: AIWriterWriteOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly tone: AIWriterTone;
        readonly format: AIWriterFormat;
        readonly length: AIWriterLength;

        destroy(): void;
    }

    class AIWriterCapabilities {
        readonly available: AICapabilityAvailability;

        createOptionsAvailable(options: AIWriterCreateCoreOptions): AICapabilityAvailability;
        languageAvailable(languageTag: string): AICapabilityAvailability;
    }

    class AIWriterCreateCoreOptions {
        tone?: AIWriterTone;
        format?: AIWriterFormat;
        length?: AIWriterLength;
    }

    class AIWriterCreateOptions extends AIWriterCreateCoreOptions implements AIBaseOptions {
        signal?: AbortSignal;
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
    }

    class AIWriterWriteOptions implements AIBaseOptions {
        signal?: AbortSignal;
        context?: string;
    }

    type AIWriterTone = "formal" | "neutral" | "casual";
    type AIWriterFormat = "plain-text" | "markdown";
    type AIWriterLength = "short" | "medium" | "long";

    // summarizer 

    class AISummarizerFactory {
        create(options?: Partial<AISummarizerCreateOptions>): Promise<AISummarizer>;
        capabilities(): Promise<AISummarizerCapabilities>;
    }

    class AISummarizer {
        summarize(input: string, options?: AISummarizerSummarizeOptions): Promise<string>;
        summarizeStreaming(input: string, options?: AISummarizerSummarizeOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly type: AISummarizerType;
        readonly format: AISummarizerFormat;
        readonly length: AISummarizerLength;

        destroy(): void;
    }

    class AISummarizerCapabilities {
        readonly available: AICapabilityAvailability;

        createOptionsAvailable(options: AISummarizerCreateCoreOptions): AICapabilityAvailability;
        languageAvailable(languageTag: string): AICapabilityAvailability;
    }

    class AISummarizerCreateCoreOptions {
        type?: AISummarizerType;
        format?: AISummarizerFormat;
        length?: AISummarizerLength;
    }

    class AISummarizerCreateOptions extends AISummarizerCreateCoreOptions implements AIBaseOptions {
        signal?: AbortSignal;
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
    }

    class AISummarizerSummarizeOptions implements AIBaseOptions {
        signal?: AbortSignal;
        context?: string;
    }

    type AISummarizerType = "tl;dr" | "key-points" | "teaser" | "headline";
    type AISummarizerFormat = "plain-text" | "markdown";
    type AISummarizerLength = "short" | "medium" | "long";

    // rewriter
    class AIRewriterFactory {
        create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
        capabilities(): Promise<AIRewriterCapabilities>;
    }

    class AIRewriter {
        rewrite(input: string, options?: AIRewriterRewriteOptions): Promise<string>;
        rewriteStreaming(input: string, options?: AIRewriterRewriteOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly tone: AIRewriterTone;
        readonly format: AIRewriterFormat;
        readonly length: AIRewriterLength;

        destroy(): void;
    }

    class AIRewriterCapabilities {
        readonly available: AICapabilityAvailability;

        createOptionsAvailable(options: AIRewriterCreateCoreOptions): AICapabilityAvailability;
        languageAvailable(languageTag: string): AICapabilityAvailability;
    }

    class AIRewriterCreateCoreOptions {
        tone?: AIRewriterTone;
        format?: AIRewriterFormat;
        length?: AIRewriterLength;
    }

    class AIRewriterCreateOptions extends AIRewriterCreateCoreOptions implements AIBaseOptions {
        signal?: AbortSignal;
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
    }

    class AIRewriterRewriteOptions implements AIBaseOptions {
        signal?: AbortSignal;
        context?: string;
    }

    type AIRewriterTone = "as-is" | "more-formal" | "more-casual";
    type AIRewriterFormat = "as-is" | "plain-text" | "markdown";
    type AIRewriterLength = "as-is" | "shorter" | "longer";

    // AIAssistant
    // see more :https://github.com/explainers-by-googlers/prompt-api/

    class AIAssistantPromptOptions implements AIBaseOptions {
        signal?: AbortSignal;
    }

    class AIAssistant {
        prompt(input: string, options?: AIAssistantPromptOptions): Promise<string>;
        promptStreaming(input: string, options?: AIAssistantPromptOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly temperature: number;
        readonly topK: number;
        readonly maxTokens: number;
        readonly tokensSoFar: number;
        readonly tokensLeft: number;

        destroy(): void;

        clone(): Promise<AIAssistant>;
    }

    class AIAssistantCreateOptions implements AIBaseOptions {
        signal?: AbortSignal;
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
        systemPrompt?: string;
        initialPrompts?: {
            role: AILanguageModelInitialPromptRole,
            content: string
        }[];
    }
    type AIAssistantCreateOptionsWithOutSystemPrompt = Exclude<AIAssistantCreateOptions, 'system'>
    type AIAssistantCreateOptionsWithOutInitialPrompts = Exclude<AIAssistantCreateOptions, 'initialPrompts'>

    class AIAssistantCapabilities {
        readonly available: AICapabilityAvailability;
        readonly defaultTemperature: number;
        // Always null if available === "no"
        readonly defaultTopK: number;
        readonly maxTopK: number;
    }

    class AIAssistantFactory {
        create(options?: AIAssistantCreateOptionsWithOutSystemPrompt | AIAssistantCreateOptionsWithOutInitialPrompts): Promise<AIAssistant>;
        capabilities(): Promise<AIAssistantCapabilities>;
    }

    interface ReadableStream<R = any> {
        [Symbol.asyncIterator](): AsyncIterableIterator<R>;
    }

    // 新版 Chrome built-in AI（Chrome 138+）将各个工厂提升为全局对象。
    // 老版本 Chrome（<138）仍然通过 window.ai.* 访问。
    // 参考: https://developer.chrome.com/docs/ai/prompt-api
    //       https://developer.chrome.com/docs/ai/inform-users-of-model-download
    interface AIAvailabilityOptions {
        // 语言与多模态相关选项（应与后续 create/prompt 调用使用的参数保持一致）
        expectedInputs?: { type: 'text' | 'audio' | 'image'; languages?: string[] }[];
        expectedOutputs?: { type: 'text'; languages?: string[] }[];
    }

    // 新版 LanguageModel 全局（替代 window.ai.languageModel）
    const LanguageModel: {
        availability(options?: AIAvailabilityOptions): Promise<AIAvailability>;
        params(): Promise<{
            defaultTopK: number;
            maxTopK: number;
            defaultTemperature: number;
            maxTemperature: number;
        }>;
        create(options?: AIAssistantCreateOptionsWithOutSystemPrompt | AIAssistantCreateOptionsWithOutInitialPrompts): Promise<AIAssistant>;
    } | undefined;

    // 新版 Summarizer 全局
    const Summarizer: {
        availability(options?: AIAvailabilityOptions): Promise<AIAvailability>;
        create(options?: Partial<AISummarizerCreateOptions>): Promise<AISummarizer>;
    } | undefined;

    // 新版 Writer 全局
    const Writer: {
        availability(options?: AIAvailabilityOptions): Promise<AIAvailability>;
        create(options?: AIWriterCreateOptions): Promise<AIWriter>;
    } | undefined;

    // 新版 Rewriter 全局
    const Rewriter: {
        availability(options?: AIAvailabilityOptions): Promise<AIAvailability>;
        create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
    } | undefined;

    // 目前本项目支持的模型键（同时对应 window.ai 的子属性与全局对象名）
    type AIModel = 'languageModel' | 'writer' | 'rewriter' | 'summarizer'

}

export { }
