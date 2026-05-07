import { describe, expect, it } from 'vitest'
import { render } from '../core/renderer'
import { applyPrimaryColor, themes } from '.'
import { thaiClassic } from './thai-classic'

describe('thaiClassic theme', () => {
  it('registers as a classic theme after the Korean classic theme', () => {
    const ids = themes.map((theme) => theme.id)
    const classicIds = themes.filter((theme) => theme.category === 'classic').map((theme) => theme.id)

    expect(classicIds).toContain('thai-classic')
    expect(ids.indexOf('thai-classic')).toBeGreaterThan(ids.indexOf('korea-classic'))
    expect(new Set(ids).size).toBe(themes.length)
  })

  it('renders markdown with Thai classic inline styles', () => {
    const html = render('# Bangkok Note\n\n## Temple Detail\n\nBody with **gold text** and `code`.\n\n```ts\nconst theme = "thai"\n```\n\n---', {
      theme: thaiClassic,
      inputType: 'markdown',
      showToc: true,
    })

    expect(html).toContain('border-top: 3px double #c9972b')
    expect(html).toContain('border-left: 5px solid #c9972b')
    expect(html).toContain('background: #fff8e8')
    expect(html).toContain('background: #252a54')
    expect(html).toContain('目录')
  })

  it('supports primary color replacement while preserving the source theme', () => {
    const customized = applyPrimaryColor(thaiClassic, '#0f766e')

    expect(customized.id).toBe('thai-classic')
    expect(customized.primaryColor).toBe('#0f766e')
    expect(customized.subtitle.borderLeft).toBe('5px solid #0f766e')
    expect(customized.title.borderTop).toBe('3px double #0f766e')
    expect(thaiClassic.primaryColor).toBe('#c9972b')
  })
})
