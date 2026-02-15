import type { CSSProperties } from 'vue'
import type { ThemeConfig } from '../themes/types'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

function cssToString(style: CSSProperties): string {
  const entries = Object.entries(style)
  return entries
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${kebabKey}: ${value}`
    })
    .join('; ')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function createMarkdownRenderer(theme: ThemeConfig): MarkdownIt {
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    highlight(str: string, lang: string): string {
      const codeStyle = cssToString(theme.codeBlock)
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          return `<pre style="${codeStyle}"><code>${highlighted}</code></pre>`
        } catch {
          // fall through
        }
      }
      const escaped = escapeHtml(str)
      return `<pre style="${codeStyle}"><code>${escaped}</code></pre>`
    },
  })

  // heading
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx]!
    const tag = token.tag
    let style: CSSProperties
    switch (tag) {
      case 'h1':
        style = theme.title
        break
      case 'h2':
        style = theme.subtitle
        break
      case 'h3':
        style = theme.heading3
        break
      case 'h4':
      case 'h5':
      case 'h6':
        style = theme.heading4
        break
      default:
        style = theme.paragraph
    }
    return `<${tag} style="${cssToString(style)}">`
  }

  md.renderer.rules.heading_close = (tokens, idx) => {
    return `</${tokens[idx]!.tag}>`
  }

  // paragraph
  md.renderer.rules.paragraph_open = () => {
    return `<p style="${cssToString(theme.paragraph)}">`
  }
  md.renderer.rules.paragraph_close = () => '</p>'

  // blockquote
  md.renderer.rules.blockquote_open = () => {
    return `<blockquote style="${cssToString(theme.blockquote)}">`
  }
  md.renderer.rules.blockquote_close = () => '</blockquote>'

  // inline code
  md.renderer.rules.code_inline = (tokens, idx) => {
    const content = escapeHtml(tokens[idx]!.content)
    return `<code style="${cssToString(theme.inlineCode)}">${content}</code>`
  }

  // link
  md.renderer.rules.link_open = (tokens, idx) => {
    const token = tokens[idx]!
    const hrefIndex = token.attrIndex('href')
    const href = hrefIndex >= 0 && token.attrs ? token.attrs[hrefIndex]![1] : '#'
    return `<a href="${href}" style="${cssToString(theme.link)}">`
  }

  // image
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]!
    const src = token.attrGet('src') || ''
    const alt = token.content || ''
    const title = token.attrGet('title') || ''
    let html = `<img src="${src}" alt="${alt}" title="${title}" style="${cssToString(theme.image)}" />`
    if (alt) {
      html += `<figcaption style="${cssToString(theme.imageCaption)}">${alt}</figcaption>`
    }
    return html
  }

  // strong
  md.renderer.rules.strong_open = () => `<strong style="${cssToString(theme.strong)}">`
  md.renderer.rules.strong_close = () => '</strong>'

  // em
  md.renderer.rules.em_open = () => `<em style="${cssToString(theme.em)}">`
  md.renderer.rules.em_close = () => '</em>'

  // bullet list / ordered list
  md.renderer.rules.bullet_list_open = () => `<ul style="${cssToString(theme.list)}">`
  md.renderer.rules.bullet_list_close = () => '</ul>'
  md.renderer.rules.ordered_list_open = () => `<ol style="${cssToString(theme.list)}">`
  md.renderer.rules.ordered_list_close = () => '</ol>'
  md.renderer.rules.list_item_open = () => `<li style="${cssToString(theme.listItem)}">`
  md.renderer.rules.list_item_close = () => '</li>'

  // table
  md.renderer.rules.table_open = () => `<table style="${cssToString(theme.table)}">`
  md.renderer.rules.table_close = () => '</table>'
  md.renderer.rules.th_open = () => `<th style="${cssToString(theme.tableHeader)}">`
  md.renderer.rules.th_close = () => '</th>'
  md.renderer.rules.td_open = () => `<td style="${cssToString(theme.tableCell)}">`
  md.renderer.rules.td_close = () => '</td>'

  // hr
  md.renderer.rules.hr = () => `<hr style="${cssToString(theme.hr)}" />`

  return md
}

export function renderMarkdown(content: string, theme: ThemeConfig): string {
  const md = createMarkdownRenderer(theme)
  return md.render(content)
}

export { cssToString }
