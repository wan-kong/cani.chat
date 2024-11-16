
export const modeList: {
    name: string,
    mode: AIMode,
    disabled?: boolean
}[] = [{
    name: 'Prompt API',
    mode: 'languageModel',
}, {
    name: 'Writer API',
    mode: 'writer',
}, {
    name: 'Rewriter API',
    mode: 'rewriter',
}, {
    name: 'Summarizer API',
    mode: 'summarizer',
}, {
    name: 'Translator API',
    mode: 'summarizer',
    disabled: true,
}, {
    name: 'Language Detector API',
    mode: 'summarizer',
    disabled: true
}]