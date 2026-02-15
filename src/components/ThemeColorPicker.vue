<template>
  <div class="theme-color-picker">
    <div class="picker-label">主题色</div>
    <div class="color-presets">
      <button
        v-for="color in presetColors"
        :key="color.value"
        class="color-dot"
        :class="{ active: activeColor === color.value }"
        :style="{ background: color.value }"
        :title="color.label"
        @click="selectColor(color.value)"
      ></button>
      <label class="color-custom" title="自定义颜色">
        <input
          type="color"
          :value="activeColor"
          @input="onCustomColor"
          class="color-input"
        />
        <span class="custom-icon">🎨</span>
      </label>
      <button
        v-if="store.customPrimaryColor"
        class="color-reset"
        @click="store.resetPrimaryColor()"
        title="重置为模板默认色"
      >
        ↩
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '../stores/editor'

const store = useEditorStore()

const presetColors = [
  { label: '经典黑', value: '#333333' },
  { label: '科技蓝', value: '#1890ff' },
  { label: 'Claude 橙', value: '#D97757' },
  { label: '微信绿', value: '#07c160' },
  { label: '玫瑰粉', value: '#e84393' },
  { label: '高贵紫', value: '#6c5ce7' },
  { label: '活力橙', value: '#e17055' },
  { label: '深邃蓝', value: '#2c3e50' },
]

const activeColor = computed(() => {
  return store.customPrimaryColor || store.currentTheme.primaryColor
})

function selectColor(color: string) {
  store.setPrimaryColor(color)
}

function onCustomColor(e: Event) {
  const input = e.target as HTMLInputElement
  store.setPrimaryColor(input.value)
}
</script>

<style scoped>
.theme-color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.picker-label {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  font-weight: 500;
}

.color-presets {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  outline: none;
}

.color-dot:hover {
  transform: scale(1.2);
}

.color-dot.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px currentColor;
}

.color-custom {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-icon {
  font-size: 16px;
  cursor: pointer;
}

.color-reset {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  color: #666;
  transition: all 0.2s;
}

.color-reset:hover {
  background: #f0f0f0;
}
</style>
