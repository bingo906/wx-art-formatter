import type { ThemeConfig } from '../themes/types'
import { cssToString } from './markdown'

// 为富文本 HTML 注入 inline style
export function injectStyles(html: string, theme: ThemeConfig): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  applyStylesToNode(body, theme)

  return body.innerHTML
}

function applyStylesToNode(node: Element, theme: ThemeConfig): void {
  const children = Array.from(node.children)

  for (const child of children) {
    const tag = child.tagName.toLowerCase()

    switch (tag) {
      case 'h1':
        applyStyle(child as HTMLElement, theme.title)
        break
      case 'h2':
        applyStyle(child as HTMLElement, theme.subtitle)
        break
      case 'h3':
        applyStyle(child as HTMLElement, theme.heading3)
        break
      case 'h4':
      case 'h5':
      case 'h6':
        applyStyle(child as HTMLElement, theme.heading4)
        break
      case 'p':
        applyStyle(child as HTMLElement, theme.paragraph)
        break
      case 'blockquote':
        applyStyle(child as HTMLElement, theme.blockquote)
        break
      case 'pre':
        applyStyle(child as HTMLElement, theme.codeBlock)
        break
      case 'code':
        if (child.parentElement?.tagName.toLowerCase() !== 'pre') {
          applyStyle(child as HTMLElement, theme.inlineCode)
        }
        break
      case 'img':
        applyStyle(child as HTMLElement, theme.image)
        break
      case 'a':
        applyStyle(child as HTMLElement, theme.link)
        break
      case 'ul':
      case 'ol':
        applyStyle(child as HTMLElement, theme.list)
        break
      case 'li':
        applyStyle(child as HTMLElement, theme.listItem)
        break
      case 'table':
        applyStyle(child as HTMLElement, theme.table)
        break
      case 'th':
        applyStyle(child as HTMLElement, theme.tableHeader)
        break
      case 'td':
        applyStyle(child as HTMLElement, theme.tableCell)
        break
      case 'hr':
        applyStyle(child as HTMLElement, theme.hr)
        break
      case 'strong':
      case 'b':
        applyStyle(child as HTMLElement, theme.strong)
        break
      case 'em':
      case 'i':
        applyStyle(child as HTMLElement, theme.em)
        break
    }

    // Recurse into children
    if (child.children.length > 0) {
      applyStylesToNode(child, theme)
    }
  }
}

function applyStyle(element: HTMLElement, style: Record<string, any>): void {
  element.setAttribute('style', cssToString(style))
}
