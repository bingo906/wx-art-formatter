import { describe, expect, it } from 'vitest'

import { themes } from '.'
import { chinaRed } from './china-red'

describe('chinaRed theme', () => {
  it('updates user-facing copy without changing identity or styling tokens', () => {
    expect(chinaRed.id).toBe('china-red')
    expect(chinaRed.name).toBe('中国red')
    expect(chinaRed.description).toContain('中国red风格')
    expect(chinaRed.primaryColor).toBe('#cf1322')
    expect(chinaRed.title.background).toBe('linear-gradient(135deg, #cf1322, #a01020)')
  })

  it('keeps the registered theme id stable for existing selections', () => {
    const registeredTheme = themes.find((theme) => theme.id === 'china-red')

    expect(registeredTheme).toBe(chinaRed)
    expect(registeredTheme?.name).toBe('中国red')
  })
})
