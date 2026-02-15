<template>
  <div class="toolbar">
    <div class="toolbar-top">
      <div class="toolbar-left">
        <TemplateSelector />
      </div>
      <div class="toolbar-right">
        <ThemeColorPicker />
        <div class="toolbar-divider"></div>
        <button
          :class="['action-btn', { active: store.showToc }]"
          @click="store.toggleToc()"
          title="生成目录"
        >
          📑 目录
        </button>
        <label class="action-btn bg-upload-btn" title="上传背景图片">
          🖼️ 背景图
          <input
            type="file"
            accept="image/*"
            class="file-input"
            @change="onBgFileChange"
          />
        </label>
        <button
          v-if="store.customBgImage"
          class="action-btn bg-clear-btn"
          @click="store.setBgImage(null)"
          title="清除背景图"
        >
          ✕ 清除背景
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../stores/editor'
import TemplateSelector from './TemplateSelector.vue'
import ThemeColorPicker from './ThemeColorPicker.vue'

const store = useEditorStore()

function onBgFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    store.setBgImage(reader.result as string)
  }
  reader.readAsDataURL(file)

  // 清空 input，允许重复选择同一文件
  input.value = ''
}
</script>

<style scoped>
.toolbar {
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  justify-content: space-between;
}

.toolbar-left {
  flex: 1;
  min-width: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e0e0e0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #555;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn:hover {
  background: #f8f8f8;
  border-color: #ccc;
}

.action-btn.active {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.bg-upload-btn {
  position: relative;
  cursor: pointer;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.bg-clear-btn {
  color: #e85d4a;
  border-color: #f0b8b0;
}

.bg-clear-btn:hover {
  background: #fef2f0;
  border-color: #e85d4a;
  color: #c0392b;
}

@media (max-width: 900px) {
  .toolbar-top {
    flex-direction: column;
  }

  .toolbar-right {
    flex-wrap: wrap;
  }
}
</style>
