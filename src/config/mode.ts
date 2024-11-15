
export const modeList = [{
    name: 'Prompt API',
    desc: `
    `
}, {
    name: 'Summarizer API',
    desc: `假设您可以让用户将冗长的文章、复杂的文档，甚至热烈的聊天对话浓缩成简洁而富有洞见的摘要。

Summarizer API 可用于生成不同长度和格式的不同类型的摘要，例如句子、段落、项目符号列表等。我们认为此 API 在以下情况下非常有用：

- 总结文章或聊天对话的要点。
- 为文章建议标题和标题。
- 为长篇幅文本创建简明扼要的信息性摘要。
- 根据图书评价为图书生成预告片。

查看更多信息：https://developer.chrome.com/docs/ai/summarizer-api?hl=zh-cn
关于此API的提案信息：https://github.com/WICG/writing-assistance-apis?tab=readme-ov-file#summarizer-api
`
}, {
    name: 'Translator API',

    desc: ``
}, {
    name: 'Writer API',

    desc: `h('span', {}, '描述信息')`
}, {
    name: 'Rewriter API',

    desc: `h('span', {}, '描述信息')`
}, {
    name: 'Language Detector API',
    desc: ` h('span', {}, '描述信息')`,
    disabled: true
}]