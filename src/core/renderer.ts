import type { ThemeConfig } from '../themes/types'
import { renderMarkdown, cssToString } from './markdown'
import { injectStyles } from './richtext'
import { extractToc, generateTocHtml } from './toc'

export interface RenderOptions {
  theme: ThemeConfig
  inputType: 'markdown' | 'richtext'
  showToc?: boolean
}

export function render(content: string, options: RenderOptions): string {
  let html: string

  if (options.inputType === 'markdown') {
    html = renderMarkdown(content, options.theme)
  } else {
    html = injectStyles(content, options.theme)
  }

  // 可选：插入目录
  if (options.showToc) {
    const tocEntries = extractToc(html)
    if (tocEntries.length > 0) {
      const tocHtml = generateTocHtml(tocEntries, options.theme)
      html = tocHtml + html
    }
  }

  // 包裹最外层容器
  const baseStyle = 'max-width: 100%; word-wrap: break-word; overflow-wrap: break-word;'
  const wrapperExtra = options.theme.wrapper ? ' ' + cssToString(options.theme.wrapper) : ''
  html = `<section style="${baseStyle}${wrapperExtra}">${html}</section>`

  return html
}
