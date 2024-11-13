import type { Options } from 'markdown-it'
import MarkdownIt from 'markdown-it'
import mathJax3 from 'markdown-it-mathjax3'
import mark from 'markdown-it-mark'
import hljs from 'highlight.js'
import iterator from 'markdown-it-for-inline'
import mdKatex from '@traptitech/markdown-it-katex'



function highlightBlock(str: string, lang = 'code') {
  return `<pre class="code-block-wrapper"><div class="code-block-extension-header"><div class="code-block-extension-headerLeft"><div class="code-block-extension-foldBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.924 9.617A1 1 0 0 0 16 9H8a1 1 0 0 0-.707 1.707l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 .217-1.09z" data-name="Down"></path></svg></div><span class="code-block-extension-lang">${lang}</span></div><div class="code-block-extension-headerRight"> <div class="code-block-extension-copyCodeBtn">复制代码</div></div></div><code class="hljs code-block-body language-${lang} ${lang}">${str}</code></pre>`
}

export const useMarkdownRender = (options?: Options) => {
  let mdi: MarkdownIt | null = null
  const initMarkdownIt = async () => {
    mdi = MarkdownIt({
      linkify: true,
      html: true,
      highlight(code: string, language: string) {
        const validLang = !!(language && hljs.getLanguage(language))
        if (validLang) {
          const lang = language ?? ''
          return highlightBlock(
            hljs.highlight(code, { language: lang, ignoreIllegals: true }).value,
            lang,
          )
        }
        return highlightBlock(hljs.highlightAuto(code).value, language)
      },
      ...options,
    })
    mdi.use(iterator, 'url_new_win', 'link_open', (tokens: any, idx: any) => {
      tokens[idx].attrPush(['target', '_blank'])
    }).use(mathJax3).use(mark).use(mdKatex, { blockClass: 'katexmath-block', errorColor: ' #cc0000' })
  }

  initMarkdownIt()

  const renderMarkdown = (content: string) => mdi?.render(content)

  return {
    renderMarkdown,

  }
}
