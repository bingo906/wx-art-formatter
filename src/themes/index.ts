import type { ThemeConfig } from './types'
import { minimal } from './minimal'
import { techBlue } from './tech-blue'
import { elegant } from './elegant'
import { business } from './business'
import { dark } from './dark'
import { claude } from './claude'
import { freshGreen } from './fresh-green'
import { rosePink } from './rose-pink'
import { gradientPurple } from './gradient-purple'
import { letterPaper } from './letter-paper'
import { sunsetGlow } from './sunset-glow'
import { chinaRed } from './china-red'
import { chinaClassic } from './china-classic'
import { japanClassic } from './japan-classic'
import { starryNight } from './starry-night'
import { morandi } from './morandi'
import { cyberpunk } from './cyberpunk'
import { mintForest } from './mint-forest'
import { claudeBg } from './claude-bg'

export const themes: ThemeConfig[] = [
  // 经典
  claude,
  minimal,
  techBlue,
  elegant,
  japanClassic,
  business,
  freshGreen,
  rosePink,
  gradientPurple,
  dark,
  // 带背景
  claudeBg,
  letterPaper,
  sunsetGlow,
  chinaRed,
  chinaClassic,
  morandi,
  mintForest,
  starryNight,
  // 创意
  cyberpunk,
]

export const defaultTheme = claude

export { type ThemeConfig, type ThemeCategory } from './types'
export { applyPrimaryColor } from './types'
