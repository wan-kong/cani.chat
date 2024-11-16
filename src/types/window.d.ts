
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

    declare type AICapabilityAvailability = "readily" | "after_download" | "no"

    declare type AILanguageModelPromptRole = "user" | 'assistant'
    declare type AILanguageModelInitialPromptRole = "system" | AILanguageModelPromptRole;

    interface AICreateMonitor {
        addEventListener(type: "downloadprogress", listener: (ev: { loaded: number; total: number }) => void, options?: boolean | AddEventListenerOptions): void;
        removeEventListener(type: "downloadprogress", listener: (ev: { loaded: number; total: number }) => void, options?: boolean | EventListenerOptions): void;
        // 可能在将来添加更多内容
    }
    type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;


    // AIWriter
    // see more : https://github.com/WICG/writing-assistance-apis?tab=readme-ov-file#summarizer-api
    interface AIWriterFactory {
        create(options?: AIWriterCreateOptions): Promise<AIWriter>;
        capabilities(): Promise<AIWriterCapabilities>;
    }

    interface AIWriter {
        write(writingTask: string, options?: AIWriterWriteOptions): Promise<string>;
        writeStreaming(writingTask: string, options?: AIWriterWriteOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly tone: AIWriterTone;
        readonly format: AIWriterFormat;
        readonly length: AIWriterLength;

        destroy(): void;
    }

    interface AIWriterCapabilities {
        readonly available: AICapabilityAvailability;

        createOptionsAvailable(options: AIWriterCreateCoreOptions): AICapabilityAvailability;
        languageAvailable(languageTag: string): AICapabilityAvailability;
    }

    interface AIWriterCreateCoreOptions {
        tone?: AIWriterTone;
        format?: AIWriterFormat;
        length?: AIWriterLength;
    }

    interface AIWriterCreateOptions extends AIWriterCreateCoreOptions, AIBaseOptions {
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
    }

    interface AIWriterWriteOptions extends AIBaseOptions {
        context?: string;
    }

    type AIWriterTone = "formal" | "neutral" | "casual";
    type AIWriterFormat = "plain-text" | "markdown";
    type AIWriterLength = "short" | "medium" | "long";


    // summarizer 

    interface AISummarizerFactory {
        create(options?: Partial<AISummarizerCreateOptions>): Promise<AISummarizer>;
        capabilities(): Promise<AISummarizerCapabilities>;
    }

    interface AISummarizer {
        summarize(input: string, options?: AISummarizerSummarizeOptions): Promise<string>;
        summarizeStreaming(input: string, options?: AISummarizerSummarizeOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly type: AISummarizerType;
        readonly format: AISummarizerFormat;
        readonly length: AISummarizerLength;

        destroy(): void;
    }

    interface AISummarizerCapabilities {
        readonly available: AICapabilityAvailability;

        createOptionsAvailable(options: AISummarizerCreateCoreOptions): AICapabilityAvailability;
        languageAvailable(languageTag: string): AICapabilityAvailability;
    }

    interface AISummarizerCreateCoreOptions {
        type?: AISummarizerType;
        format?: AISummarizerFormat;
        length?: AISummarizerLength;
    }

    interface AISummarizerCreateOptions extends AISummarizerCreateCoreOptions, AIBaseOptions {
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
    }

    interface AISummarizerSummarizeOptions extends AIBaseOptions {
        context?: string;
    }

    type AISummarizerType = "tl;dr" | "key-points" | "teaser" | "headline";
    type AISummarizerFormat = "plain-text" | "markdown";
    type AISummarizerLength = "short" | "medium" | "long";


    // rewriter
    interface AIRewriterFactory {
        create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
        capabilities(): Promise<AIRewriterCapabilities>;
    }

    interface AIRewriter {
        rewrite(input: string, options?: AIRewriterRewriteOptions): Promise<string>;
        rewriteStreaming(input: string, options?: AIRewriterRewriteOptions): ReadableStream<string>;

        readonly sharedContext: string;
        readonly tone: AIRewriterTone;
        readonly format: AIRewriterFormat;
        readonly length: AIRewriterLength;

        destroy(): void;
    }

    interface AIRewriterCapabilities {
        readonly available: AICapabilityAvailability;

        createOptionsAvailable(options: AIRewriterCreateCoreOptions): AICapabilityAvailability;
        languageAvailable(languageTag: string): AICapabilityAvailability;
    }

    interface AIRewriterCreateCoreOptions {
        tone?: AIRewriterTone;
        format?: AIRewriterFormat;
        length?: AIRewriterLength;
    }

    interface AIRewriterCreateOptions extends AIRewriterCreateCoreOptions, AIBaseOptions {
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
    }

    interface AIRewriterRewriteOptions extends AIBaseOptions {
        context?: string;
    }

    type AIRewriterTone = "as-is" | "more-formal" | "more-casual";
    type AIRewriterFormat = "as-is" | "plain-text" | "markdown";
    type AIRewriterLength = "as-is" | "shorter" | "longer";

    // AIAssistant
    // see more :https://github.com/explainers-by-googlers/prompt-api/

    interface AIAssistantPromptOptions extends AIBaseOptions {
    }

    interface AIAssistant {
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

    interface AIAssistantCreateOptions extends AIBaseOptions {
        monitor?: AICreateMonitorCallback;
        sharedContext?: string;
        systemPrompt?: string
        initialPrompts?: {
            role: AILanguageModelInitialPromptRole,
            content: string
        }[]
    }

    interface AIAssistantCapabilities {
        readonly available: AICapabilityAvailability;
        readonly defaultTemperature: number;
        // Always null if available === "no"
        readonly defaultTopK: number;
        readonly maxTopK: number;
    }


    interface AIAssistantFactory {
        create(options?: AIAssistantCreateOptions): Promise<AIAssistant>;
        capabilities(): Promise<AIAssistantCapabilities>;
    }

    interface ReadableStream<R = any> {
        [Symbol.asyncIterator](): AsyncIterableIterator<R>;
    }

    type AIMode = keyof typeof window.ai

}

export { }
