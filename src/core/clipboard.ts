export async function copyHtmlToClipboard(html: string): Promise<boolean> {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const blob = new Blob([html], { type: 'text/html' })
      const textBlob = new Blob([html], { type: 'text/plain' })
      const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob,
      })
      await navigator.clipboard.write([item])
      return true
    }

    // Fallback: use execCommand
    const container = document.createElement('div')
    container.innerHTML = html
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    container.setAttribute('contenteditable', 'true')
    document.body.appendChild(container)

    const range = document.createRange()
    range.selectNodeContents(container)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    document.execCommand('copy')
    document.body.removeChild(container)
    return true
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}
