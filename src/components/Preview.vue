<template>
  <div class="preview-container">
    <div class="preview-header">
      <span class="preview-title">预览</span>
      <div class="preview-actions">
        <button class="preview-btn" @click="toggleWidth" :title="isWide ? '手机宽度' : '宽屏'">
          {{ isWide ? '📱' : '🖥️' }}
        </button>
        <button class="preview-btn" @click="showFullscreen = true" title="全屏预览">
          ⛶
        </button>
        <button
          class="export-btn"
          @click="handleExportImage"
          :disabled="!!exporting"
          title="导出为长图"
        >
          {{ exporting === 'image' ? '⏳ 导出中...' : '🖼️ 导出图片' }}
        </button>
        <button
          class="export-btn"
          @click="handleExportPdf"
          :disabled="!!exporting"
          title="导出为 PDF"
        >
          {{ exporting === 'pdf' ? '⏳ 导出中...' : '📄 导出PDF' }}
        </button>
        <div class="xhs-wrapper">
          <button
            class="export-btn xhs-btn"
            @click="showXhsMenu = !showXhsMenu"
            :disabled="!!exporting"
            title="导出小红书图片"
          >
            {{ exporting === 'xhs' ? '⏳ 导出中...' : '📕 小红书' }}
          </button>
          <div v-if="showXhsMenu" class="xhs-menu">
            <div class="xhs-menu-title">选择图片比例</div>
            <button class="xhs-option" @click="handleExportXhs('3:4')">
              <span class="xhs-ratio">3:4 竖图</span>
              <span class="xhs-size">1080x1440</span>
              <span class="xhs-tag">推荐</span>
            </button>
            <button class="xhs-option" @click="handleExportXhs('1:1')">
              <span class="xhs-ratio">1:1 方图</span>
              <span class="xhs-size">1080x1080</span>
            </button>
            <button class="xhs-option" @click="handleExportXhs('4:3')">
              <span class="xhs-ratio">4:3 横图</span>
              <span class="xhs-size">1080x810</span>
            </button>
          </div>
        </div>
        <button class="copy-btn" @click="handleCopy">
          {{ copied ? '✅ 已复制' : '📋 一键复制' }}
        </button>
      </div>
    </div>
    <div class="preview-body" :class="{ wide: isWide }">
      <PhoneFrame v-if="!isWide" />
      <div v-else class="wide-preview" v-html="store.renderedHtml"></div>
    </div>
  </div>

  <!-- 全屏预览弹窗 -->
  <Teleport to="body">
    <div v-if="showFullscreen" class="fullscreen-overlay" @click.self="showFullscreen = false">
      <div class="fullscreen-dialog">
        <div class="fullscreen-header">
          <span class="fullscreen-title">全屏预览</span>
          <div class="fullscreen-actions">
            <button class="fs-btn" @click="fsMode = 'phone'" :class="{ active: fsMode === 'phone' }">📱 手机</button>
            <button class="fs-btn" @click="fsMode = 'wide'" :class="{ active: fsMode === 'wide' }">🖥️ 宽屏</button>
            <button
              class="fs-btn"
              @click="handleExportImage"
              :disabled="!!exporting"
              title="导出为长图"
            >
              {{ exporting === 'image' ? '⏳...' : '🖼️ 图片' }}
            </button>
            <button
              class="fs-btn"
              @click="handleExportPdf"
              :disabled="!!exporting"
              title="导出为 PDF"
            >
              {{ exporting === 'pdf' ? '⏳...' : '📄 PDF' }}
            </button>
            <div class="xhs-wrapper">
              <button
                class="fs-btn"
                @click="showXhsMenuFs = !showXhsMenuFs"
                :disabled="!!exporting"
                title="导出小红书图片"
              >
                {{ exporting === 'xhs' ? '⏳...' : '📕 小红书' }}
              </button>
              <div v-if="showXhsMenuFs" class="xhs-menu">
                <div class="xhs-menu-title">选择图片比例</div>
                <button class="xhs-option" @click="handleExportXhs('3:4')">
                  <span class="xhs-ratio">3:4 竖图</span>
                  <span class="xhs-size">1080x1440</span>
                  <span class="xhs-tag">推荐</span>
                </button>
                <button class="xhs-option" @click="handleExportXhs('1:1')">
                  <span class="xhs-ratio">1:1 方图</span>
                  <span class="xhs-size">1080x1080</span>
                </button>
                <button class="xhs-option" @click="handleExportXhs('4:3')">
                  <span class="xhs-ratio">4:3 横图</span>
                  <span class="xhs-size">1080x810</span>
                </button>
              </div>
            </div>
            <button class="fs-copy-btn" @click="handleCopy">
              {{ copied ? '✅ 已复制' : '📋 复制' }}
            </button>
            <button class="fs-close" @click="showFullscreen = false" title="关闭">✕</button>
          </div>
        </div>
        <div class="fullscreen-body">
          <PhoneFrame v-if="fsMode === 'phone'" />
          <div v-else class="fs-wide-preview" v-html="store.renderedHtml"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../stores/editor'
import { copyHtmlToClipboard } from '../core/clipboard'
import { exportAsImage, exportAsPdf, exportForXiaohongshu } from '../core/export'
import type { XhsRatio } from '../core/export'
import PhoneFrame from './PhoneFrame.vue'

const store = useEditorStore()
const isWide = ref(false)
const showFullscreen = ref(false)
const fsMode = ref<'phone' | 'wide'>('phone')
const copied = ref(false)
const exporting = ref<'image' | 'pdf' | 'xhs' | null>(null)
const showXhsMenu = ref(false)
const showXhsMenuFs = ref(false)

function toggleWidth() {
  isWide.value = !isWide.value
}

async function handleCopy() {
  const success = await copyHtmlToClipboard(store.renderedHtml)
  if (success) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

async function handleExportImage() {
  if (exporting.value) return
  if (!store.renderedHtml || store.renderedHtml.trim() === '') return
  exporting.value = 'image'
  try {
    await exportAsImage({
      html: store.renderedHtml,
      width: 375,
      scale: 2,
      filename: 'wechat-article',
    })
  } finally {
    exporting.value = null
  }
}

async function handleExportPdf() {
  if (exporting.value) return
  if (!store.renderedHtml || store.renderedHtml.trim() === '') return
  exporting.value = 'pdf'
  try {
    await exportAsPdf({
      html: store.renderedHtml,
      width: 375,
      scale: 2,
      filename: 'wechat-article',
    })
  } finally {
    exporting.value = null
  }
}

async function handleExportXhs(ratio: XhsRatio) {
  showXhsMenu.value = false
  showXhsMenuFs.value = false
  if (exporting.value) return
  if (!store.renderedHtml || store.renderedHtml.trim() === '') return
  exporting.value = 'xhs'
  try {
    await exportForXiaohongshu({
      html: store.renderedHtml,
    }, ratio)
  } finally {
    exporting.value = null
  }
}
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.preview-title {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.preview-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.preview-btn {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.preview-btn:hover {
  background: #f0f0f0;
}

.copy-btn {
  padding: 4px 12px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.export-btn {
  padding: 4px 10px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #555;
  transition: all 0.2s;
  white-space: nowrap;
}

.export-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #ccc;
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== 小红书比例选择菜单 ===== */
.xhs-wrapper {
  position: relative;
}

.xhs-btn {
  border-color: #ff4757;
  color: #ff4757;
}

.xhs-btn:hover:not(:disabled) {
  background: #fff5f5;
  border-color: #ff4757;
}

.xhs-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 100;
  min-width: 200px;
  padding: 8px 0;
}

.xhs-menu-title {
  padding: 6px 14px;
  font-size: 11px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
}

.xhs-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: background 0.15s;
  text-align: left;
}

.xhs-option:hover {
  background: #fff5f5;
}

.xhs-ratio {
  font-weight: 500;
  min-width: 64px;
}

.xhs-size {
  font-size: 11px;
  color: #999;
}

.xhs-tag {
  font-size: 10px;
  background: #ff4757;
  color: #fff;
  padding: 1px 6px;
  border-radius: 8px;
  margin-left: auto;
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.preview-body.wide {
  padding: 24px;
}

.wide-preview {
  max-width: 680px;
  width: 100%;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 100%;
}

.wide-preview :deep(img) {
  max-width: 100% !important;
}

/* ===== 全屏弹窗 ===== */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.fullscreen-dialog {
  width: 100%;
  height: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  flex-shrink: 0;
}

.fullscreen-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.fullscreen-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.fs-btn {
  padding: 5px 12px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}

.fs-btn:hover {
  background: #f0f0f0;
}

.fs-btn.active {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.fs-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fs-copy-btn {
  padding: 5px 14px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.fs-copy-btn:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.fs-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  transition: all 0.2s;
  margin-left: 4px;
}

.fs-close:hover {
  background: #f0f0f0;
  color: #333;
}

.fullscreen-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.fs-wide-preview {
  max-width: 680px;
  width: 100%;
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.fs-wide-preview :deep(img) {
  max-width: 100% !important;
}
</style>
