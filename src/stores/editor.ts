import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeConfig } from '../themes/types'
import { themes, defaultTheme, applyPrimaryColor } from '../themes'
import { render } from '../core/renderer'

const SAMPLE_MARKDOWN = `# 欢迎使用微信公众号排版工具

## 简介

这是一款**纯前端**的微信公众号文章排版工具，支持 Markdown 输入，一键生成适合微信公众号的排版样式。

## 功能特性

- 🎨 **多套精美模板** — 9 种预设风格任你选择
- 🎯 **主题色自定义** — 随心切换品牌色调
- 📱 **手机端预览** — 实时查看排版效果
- 📋 **一键复制** — 粘贴到微信公众号编辑器即可

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, 微信公众号！");
  return "排版真方便";
}
\`\`\`

行内代码也支持：使用 \`npm install\` 安装依赖。

## 引用样式

> 好的排版让读者更舒适，让内容更有力量。
> — 一个热爱排版的开发者

## 表格展示

| 功能 | 描述 | 状态 |
|------|------|------|
| Markdown 渲染 | 完整的 Markdown 语法支持 | ✅ |
| 模板切换 | 多套精美预设模板 | ✅ |
| 主题色 | 自定义主题色切换 | ✅ |
| 一键复制 | 复制到微信编辑器 | ✅ |

## 使用方法

1. 在左侧编辑器中输入 Markdown 内容
2. 在顶部选择喜欢的模板和主题色
3. 右侧实时预览排版效果
4. 点击「一键复制」按钮
5. 在微信公众号编辑器中粘贴

---

*开始创作你的精彩文章吧！*
`

export const useEditorStore = defineStore('editor', () => {
  const content = ref(SAMPLE_MARKDOWN)
  const inputType = ref<'markdown' | 'richtext'>('markdown')
  const currentTheme = ref<ThemeConfig>(defaultTheme)
  const customPrimaryColor = ref<string | null>(null)
  const customBgImage = ref<string | null>(null)
  const showToc = ref(false)

  const activeTheme = computed(() => {
    let theme = currentTheme.value
    if (customPrimaryColor.value) {
      theme = applyPrimaryColor(theme, customPrimaryColor.value)
    }
    // 注入自定义背景图
    if (customBgImage.value) {
      const bgStyle = `url(${customBgImage.value}) center/cover no-repeat`
      const wrapper = { ...(theme.wrapper || {}), background: bgStyle }
      return { ...theme, wrapper }
    }
    return theme
  })

  const renderedHtml = computed(() => {
    return render(content.value, {
      theme: activeTheme.value,
      inputType: inputType.value,
      showToc: showToc.value,
    })
  })

  function setTheme(themeId: string) {
    const found = themes.find((t) => t.id === themeId)
    if (found) {
      currentTheme.value = found
      customPrimaryColor.value = null
    }
  }

  function setPrimaryColor(color: string) {
    customPrimaryColor.value = color
  }

  function resetPrimaryColor() {
    customPrimaryColor.value = null
  }

  function setBgImage(dataUrl: string | null) {
    customBgImage.value = dataUrl
  }

  function setContent(text: string) {
    content.value = text
  }

  function setInputType(type: 'markdown' | 'richtext') {
    inputType.value = type
  }

  function toggleToc() {
    showToc.value = !showToc.value
  }

  return {
    content,
    inputType,
    currentTheme,
    customPrimaryColor,
    customBgImage,
    activeTheme,
    renderedHtml,
    showToc,
    setTheme,
    setPrimaryColor,
    resetPrimaryColor,
    setBgImage,
    setContent,
    setInputType,
    toggleToc,
  }
})
