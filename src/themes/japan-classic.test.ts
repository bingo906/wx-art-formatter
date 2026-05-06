import { describe, expect, it } from 'vitest'
import { render } from '../core/renderer'
import { applyPrimaryColor, themes } from '.'
import { japanClassic } from './japan-classic'

describe('japanClassic theme', () => {
  it('registers as a classic theme without replacing existing classic options', () => {
    const ids = themes.map((theme) => theme.id)
    const classicIds = themes.filter((theme) => theme.category === 'classic').map((theme) => theme.id)

    expect(ids).toContain('claude')
    expect(classicIds).toContain('japan-classic')
    expect(new Set(ids).size).toBe(themes.length)
  })

  it('renders markdown with Japanese classic inline styles', () => {
    const html = render('# 旅の記録\n\n## 見出し\n\n本文と **強調**、`code`。\n\n---', {
      theme: japanClassic,
      inputType: 'markdown',
      showToc: true,
    })

    expect(html).toContain('border-bottom: 2px solid #b23a32')
    expect(html).toContain('border-left: 5px solid #b23a32')
    expect(html).toContain('background: #faf7f0')
    expect(html).toContain('目录')
  })

  it('supports primary color replacement while preserving the source theme', () => {
    const customized = applyPrimaryColor(japanClassic, '#2f4f5f')

    expect(customized.id).toBe('japan-classic')
    expect(customized.primaryColor).toBe('#2f4f5f')
    expect(customized.title.color).toBe('#2f4f5f')
    expect(customized.subtitle.borderLeft).toBe('5px solid #2f4f5f')
    expect(japanClassic.primaryColor).toBe('#b23a32')
  })
})
