import type { CSSProperties } from 'vue'

export type ThemeCategory = 'classic' | 'background' | 'creative'

export interface ThemeConfig {
  id: string
  name: string
  description: string
  primaryColor: string
  category: ThemeCategory     // 模板分类
  // 全局容器样式（背景色、背景图、内边距等）
  wrapper?: CSSProperties
  // 各元素样式
  title: CSSProperties        // h1
  subtitle: CSSProperties     // h2
  heading3: CSSProperties     // h3
  heading4: CSSProperties     // h4
  paragraph: CSSProperties    // p
  blockquote: CSSProperties
  blockquoteContent: CSSProperties
  codeBlock: CSSProperties
  inlineCode: CSSProperties
  image: CSSProperties
  imageCaption: CSSProperties
  link: CSSProperties
  list: CSSProperties
  listItem: CSSProperties
  table: CSSProperties
  tableHeader: CSSProperties
  tableCell: CSSProperties
  hr: CSSProperties
  strong: CSSProperties
  em: CSSProperties
  // 特殊组件
  footnote: CSSProperties
  toc: CSSProperties
  tocItem: CSSProperties
}

// 用于动态替换主题色的辅助函数
export function applyPrimaryColor(theme: ThemeConfig, color: string): ThemeConfig {
  const json = JSON.stringify(theme)
  const replaced = json.replace(new RegExp(escapeRegExp(theme.primaryColor), 'g'), color)
  const newTheme = JSON.parse(replaced) as ThemeConfig
  newTheme.primaryColor = color
  return newTheme
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
