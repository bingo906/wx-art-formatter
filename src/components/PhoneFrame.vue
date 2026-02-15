<template>
  <div class="phone-frame">
    <div class="phone-notch"></div>
    <div class="phone-screen">
      <div class="phone-status-bar">
        <span>9:41</span>
        <span class="status-icons">📶 🔋</span>
      </div>
      <div class="phone-header">
        <span class="back-arrow">‹</span>
        <span class="header-title">文章预览</span>
        <span class="header-dots">•••</span>
      </div>
      <div class="phone-content">
        <div v-html="store.renderedHtml"></div>
      </div>
    </div>
    <div class="phone-home-indicator"></div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../stores/editor'

const store = useEditorStore()
</script>

<style scoped>
.phone-frame {
  width: 375px;
  min-height: 680px;
  max-height: 100%;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 0 0 2px #d4d4d8, 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.phone-notch {
  width: 120px;
  height: 24px;
  background: #1a1a1a;
  border-radius: 0 0 16px 16px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.phone-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.phone-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 24px;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: -12px;
}

.status-icons {
  font-size: 10px;
}

.phone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.back-arrow {
  font-size: 22px;
  color: #333;
  font-weight: 300;
}

.header-title {
  font-weight: 500;
  color: #1a1a1a;
}

.header-dots {
  color: #999;
  letter-spacing: 2px;
}

.phone-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
}

.phone-content :deep(img) {
  max-width: 100% !important;
}

.phone-content :deep(pre) {
  overflow-x: auto !important;
  white-space: pre !important;
  word-wrap: normal !important;
}

.phone-content :deep(table) {
  display: block;
  overflow-x: auto;
}

.phone-home-indicator {
  width: 120px;
  height: 4px;
  background: #d4d4d8;
  border-radius: 2px;
  margin: 8px auto 12px;
}
</style>
