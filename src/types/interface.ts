
export enum Role {
    USER = 'user',
    SYSTEM = 'system'
}

export enum Model {
    Prompt = 'prompt',
    Summarizer = 'summarizer',
    LanguageDetector = 'language_detector',
    Translator = 'translator',
    Writer = 'writer',
    ReWriter = 'rewriter',
}

export interface SessionItem {
    id: string;
    name: string;
    mode: Model;
    create_at: string;
    update_at: string;
}

export interface MessageItem {
    id: string
    session_id: SessionItem['id']
    role: Role
    content: string
    create_at: string
    update_at: string
}

export interface UserInput {
    session_id: SessionItem['id']
    disabled?: boolean
    placeholder: string
    content: string
}