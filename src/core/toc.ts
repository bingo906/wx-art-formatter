import type { ThemeConfig } from '../themes/types'
import { cssToString } from './markdown'

interface TocEntry {
  level: number
  text: string
  id: string
}

export function extractToc(html: string): TocEntry[] {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
  const entries: TocEntry[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]!)
    const text = match[2]!.replace(/<[^>]*>/g, '')
    const id = text.replace(/\s+/g, '-').toLowerCase()
    entries.push({ level, text, id })
  }

  return entries
}

export function generateTocHtml(entries: TocEntry[], theme: ThemeConfig): string {
  if (entries.length === 0) return ''

  const tocStyle = cssToString(theme.toc)
  const itemStyle = cssToString(theme.tocItem)
  const titleStyle = `font-size: 16px; font-weight: bold; margin-bottom: 8px; color: ${theme.primaryColor};`

  let html = `<section style="${tocStyle}">`
  html += `<p style="${titleStyle}">目录</p>`

  for (const entry of entries) {
    const indent = (entry.level - 1) * 16
    html += `<p style="${itemStyle}; padding-left: ${indent}px; margin: 0;">${entry.text}</p>`
  }

  html += '</section>'
  return html
}
