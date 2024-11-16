
export enum Model {
    Prompt = 'assistant',
    Summarizer = 'summarizer',
    LanguageDetector = 'language_detector',
    Translator = 'translator',
    Writer = 'writer',
    ReWriter = 'rewriter',
}
export type AILanguageModelInitialPromptStatus = 'loading' | "running" | 'completed' | 'error'

export interface SessionItem {
    id: string;
    name: string;
    // 是否不可
    deletable?: boolean;
    mode: AIMode;
    create_at: string;
    update_at: string;
}

export interface MessageItem {
    id: string
    session_id: SessionItem['id']
    role: AILanguageModelInitialPromptRole
    content: string
    status: AILanguageModelInitialPromptStatus
    create_at: string
    update_at: string
}

export interface UserInput {
    session_id: SessionItem['id']
    disabled?: boolean
    loading?: boolean
    placeholder: string
    content: string
}