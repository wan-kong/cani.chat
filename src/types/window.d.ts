declare global {

    interface Window {
        ai: {
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

    type AICapabilityAvailability = "readily" | "after-download" | "no"
    type AILanguageModelPromptRole = "user" | 'assistant'
    type AILanguageModelInitialPromptRole = "system" | AILanguageModelPromptRole;

    interface AICreateMonitor {
        addEventListener(type: "downloadprogress", listener: (ev: { loaded: number; total: number }) => void, options?: boolean | AddEventListenerOptions): void;
        removeEventListener(type: "downloadprogress", listener: (ev: { loaded: number; total: number }) => void, options?: boolean | EventListenerOptions): void;
        // 可能在将来添加更多内容
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

    type AIModel = keyof typeof window.ai

}

export { }
