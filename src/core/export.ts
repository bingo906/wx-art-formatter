import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'

export interface ExportOptions {
  /** The rendered HTML string to export */
  html: string
  /** Width of the rendered content in pixels. Default: 375 */
  width?: number
  /** Pixel ratio for image quality. Default: 2 */
  scale?: number
  /** Filename without extension. Default: 'wechat-article' */
  filename?: string
}

// highlight.js One Dark 风格的基础语法高亮样式
const HLJS_STYLES = `
  .hljs-keyword { color: #c678dd; }
  .hljs-string { color: #98c379; }
  .hljs-number { color: #d19a66; }
  .hljs-literal { color: #56b6c2; }
  .hljs-comment { color: #5c6370; font-style: italic; }
  .hljs-built_in { color: #e6c07b; }
  .hljs-function { color: #61afef; }
  .hljs-title { color: #61afef; }
  .hljs-class .hljs-title { color: #e6c07b; }
  .hljs-params { color: #abb2bf; }
  .hljs-attr { color: #d19a66; }
  .hljs-attribute { color: #98c379; }
  .hljs-selector-tag { color: #e06c75; }
  .hljs-selector-class { color: #d19a66; }
  .hljs-selector-id { color: #61afef; }
  .hljs-variable { color: #e06c75; }
  .hljs-type { color: #e6c07b; }
  .hljs-meta { color: #61afef; }
  .hljs-tag { color: #e06c75; }
  .hljs-name { color: #e06c75; }
  .hljs-symbol { color: #56b6c2; }
  .hljs-bullet { color: #d19a66; }
  .hljs-addition { color: #98c379; }
  .hljs-deletion { color: #e06c75; }
  .hljs-regexp { color: #98c379; }
  .hljs-template-variable { color: #e06c75; }
  .hljs-link { color: #61afef; }
  .hljs { background: transparent !important; }
`

/**
 * 创建离屏容器，注入 HTML 并用 html2canvas 渲染为 canvas
 */
async function renderToCanvas(options: ExportOptions): Promise<HTMLCanvasElement> {
  const {
    html,
    width = 375,
    scale = 2,
  } = options

  // 创建离屏容器
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = `${width}px`
  container.style.background = '#ffffff'
  container.style.zIndex = '-1'
  container.style.fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif`
  container.style.padding = '16px'

  // 注入渲染后的 HTML
  container.innerHTML = html

  // 注入代码高亮样式 + 代码块换行样式
  const style = document.createElement('style')
  style.textContent = `
    ${HLJS_STYLES}
    pre { overflow-x: visible !important; white-space: pre-wrap !important; word-wrap: break-word !important; }
    table { table-layout: fixed !important; width: 100% !important; }
    img { max-width: 100% !important; }
  `
  container.appendChild(style)

  document.body.appendChild(container)

  // 等待图片加载完成
  const images = container.querySelectorAll('img')
  if (images.length > 0) {
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve()
      return new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.onerror = () => resolve()
      })
    })
    await Promise.all(imagePromises)
  }

  try {
    const canvas = await html2canvas(container, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width,
      windowWidth: width,
      logging: false,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    })
    return canvas
  } finally {
    document.body.removeChild(container)
  }
}

/**
 * 导出渲染后的 HTML 为 PNG 长图并下载
 */
export async function exportAsImage(options: ExportOptions): Promise<boolean> {
  try {
    const canvas = await renderToCanvas(options)
    const filename = (options.filename || 'wechat-article') + '.png'

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0)
    })

    if (!blob) {
      console.error('Export image: failed to create blob')
      return false
    }

    // 通过 <a> 标签触发下载
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    return true
  } catch (err) {
    console.error('Export image failed:', err)
    return false
  }
}

/**
 * 小红书图片比例类型
 */
export type XhsRatio = '3:4' | '1:1' | '4:3'

const XHS_DIMENSIONS: Record<XhsRatio, { width: number; height: number }> = {
  '3:4': { width: 1080, height: 1440 },
  '1:1': { width: 1080, height: 1080 },
  '4:3': { width: 1080, height: 810 },
}

/**
 * 导出为小红书多张图片（按比例切割长图，逐张下载）
 */
export async function exportForXiaohongshu(
  options: ExportOptions,
  ratio: XhsRatio = '3:4',
): Promise<boolean> {
  try {
    const dim = XHS_DIMENSIONS[ratio]
    // 以 1080px 宽度、scale=1 渲染完整长图
    const canvas = await renderToCanvas({
      ...options,
      width: dim.width,
      scale: 1,
    })

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const pageHeight = dim.height
    const totalPages = Math.ceil(canvasHeight / pageHeight)

    for (let i = 0; i < totalPages; i++) {
      const srcY = i * pageHeight
      const sliceH = Math.min(pageHeight, canvasHeight - srcY)

      // 创建固定尺寸的临时 canvas（不足部分留白）
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = dim.width
      pageCanvas.height = dim.height
      const ctx = pageCanvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, dim.width, dim.height)
      ctx.drawImage(
        canvas,
        0, srcY, canvasWidth, sliceH,
        0, 0, dim.width, sliceH,
      )

      const blob = await new Promise<Blob | null>((resolve) => {
        pageCanvas.toBlob(resolve, 'image/png', 1.0)
      })
      if (!blob) continue

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `xiaohongshu-${i + 1}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)

      // 间隔 200ms，避免浏览器拦截批量下载
      if (i < totalPages - 1) {
        await new Promise((r) => setTimeout(r, 200))
      }
    }

    return true
  } catch (err) {
    console.error('Export Xiaohongshu images failed:', err)
    return false
  }
}

/**
 * 导出渲染后的 HTML 为 PDF 文档并下载
 */
export async function exportAsPdf(options: ExportOptions): Promise<boolean> {
  try {
    const canvas = await renderToCanvas(options)
    const filename = (options.filename || 'wechat-article') + '.pdf'

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // A4 尺寸 (mm)
    const pdfWidth = 210
    const pdfPageHeight = 297
    const margin = 10
    const contentWidth = pdfWidth - margin * 2
    const contentHeight = pdfPageHeight - margin * 2

    // 计算图片在 PDF 上的尺寸
    const imgWidth = contentWidth
    const imgHeight = (canvasHeight * imgWidth) / canvasWidth

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    if (imgHeight <= contentHeight) {
      // 单页：直接放入
      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
    } else {
      // 多页：按页切割 canvas
      const pageSourceHeight = Math.floor((contentHeight / imgHeight) * canvasHeight)
      let srcY = 0
      let pageIndex = 0

      while (srcY < canvasHeight) {
        if (pageIndex > 0) pdf.addPage()

        const sliceH = Math.min(pageSourceHeight, canvasHeight - srcY)

        // 为当前页创建临时 canvas 切片
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvasWidth
        pageCanvas.height = sliceH
        const ctx = pageCanvas.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvasWidth, sliceH)
        ctx.drawImage(
          canvas,
          0, srcY, canvasWidth, sliceH,
          0, 0, canvasWidth, sliceH,
        )

        const sliceData = pageCanvas.toDataURL('image/png', 1.0)
        const sliceImgHeight = (sliceH * imgWidth) / canvasWidth

        pdf.addImage(sliceData, 'PNG', margin, margin, imgWidth, sliceImgHeight)

        srcY += sliceH
        pageIndex++
      }
    }

    pdf.save(filename)
    return true
  } catch (err) {
    console.error('Export PDF failed:', err)
    return false
  }
}
