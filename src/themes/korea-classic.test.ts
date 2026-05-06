import { describe, expect, it } from 'vitest'
import { render } from '../core/renderer'
import { applyPrimaryColor, themes } from '.'
import { koreaClassic } from './korea-classic'

describe('koreaClassic theme', () => {
  it('registers as a classic theme without duplicate theme ids', () => {
    const ids = themes.map((theme) => theme.id)
    const classicIds = themes.filter((theme) => theme.category === 'classic').map((theme) => theme.id)

    expect(classicIds).toContain('korea-classic')
    expect(ids.indexOf('korea-classic')).toBeGreaterThan(ids.indexOf('japan-classic'))
    expect(new Set(ids).size).toBe(themes.length)
  })

  it('renders markdown with Korean classic inline styles', () => {
    const html = render('# Seoul Note\n\n## Hanji Layout\n\nBody with **strong text** and `code`.\n\n```ts\nconst theme = "korea"\n```\n\n---', {
      theme: koreaClassic,
      inputType: 'markdown',
      showToc: true,
    })

    expect(html).toContain('border-top: 3px solid #b6423c')
    expect(html).toContain('border-left: 5px solid #b6423c')
    expect(html).toContain('background: #fbf7ee')
    expect(html).toContain('background: #24364b')
  })

  it('supports primary color replacement while preserving the source theme', () => {
    const customized = applyPrimaryColor(koreaClassic, '#7a2f78')

    expect(customized.id).toBe('korea-classic')
    expect(customized.primaryColor).toBe('#7a2f78')
    expect(customized.subtitle.color).toBe('#7a2f78')
    expect(customized.subtitle.borderLeft).toBe('5px solid #7a2f78')
    expect(koreaClassic.primaryColor).toBe('#b6423c')
  })
})
