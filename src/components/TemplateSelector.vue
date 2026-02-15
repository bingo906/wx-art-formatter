<template>
  <div class="template-selector">
    <div class="category-tabs">
      <button
        :class="['cat-tab', { active: activeCategory === 'all' }]"
        @click="activeCategory = 'all'"
      >
        全部
      </button>
      <button
        :class="['cat-tab', { active: activeCategory === 'classic' }]"
        @click="activeCategory = 'classic'"
      >
        经典
      </button>
      <button
        :class="['cat-tab', { active: activeCategory === 'background' }]"
        @click="activeCategory = 'background'"
      >
        背景
      </button>
      <button
        :class="['cat-tab', { active: activeCategory === 'creative' }]"
        @click="activeCategory = 'creative'"
      >
        创意
      </button>
    </div>
    <div class="template-grid">
      <button
        v-for="theme in filteredThemes"
        :key="theme.id"
        :class="['template-card', { active: store.currentTheme.id === theme.id }]"
        @click="store.setTheme(theme.id)"
        :title="theme.description"
      >
        <div class="card-preview" :style="getPreviewStyle(theme)">
          <div class="preview-bar" :style="{ background: theme.primaryColor }"></div>
          <div class="preview-lines">
            <span class="pline pline-title" :style="{ background: theme.primaryColor }"></span>
            <span class="pline pline-text"></span>
            <span class="pline pline-text short"></span>
          </div>
        </div>
        <div class="card-info">
          <span class="card-dot" :style="{ background: theme.primaryColor }"></span>
          <span class="card-name">{{ theme.name }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '../stores/editor'
import { themes } from '../themes'
import type { ThemeConfig, ThemeCategory } from '../themes'

const store = useEditorStore()
const activeCategory = ref<ThemeCategory | 'all'>('all')

const filteredThemes = computed(() => {
  if (activeCategory.value === 'all') return themes
  return themes.filter((t) => t.category === activeCategory.value)
})

function getPreviewStyle(theme: ThemeConfig): Record<string, string> {
  if (theme.wrapper) {
    const bg = (theme.wrapper as Record<string, unknown>).background as string | undefined
    const bgImg = (theme.wrapper as Record<string, unknown>).backgroundImage as string | undefined
    const style: Record<string, string> = {}
    if (bg) style.background = bg
    if (bgImg) style.backgroundImage = bgImg
    return style
  }
  return { background: '#fff' }
}
</script>

<style scoped>
.template-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-tabs {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
  width: fit-content;
}

.cat-tab {
  padding: 4px 12px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #888;
  transition: all 0.2s;
  font-weight: 500;
}

.cat-tab:hover {
  color: #555;
}

.cat-tab.active {
  background: #fff;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.template-grid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.template-card {
  display: flex;
  flex-direction: column;
  width: 72px;
  border: 2px solid transparent;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.template-card:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.template-card.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 1px #1890ff, 0 2px 8px rgba(24, 144, 255, 0.2);
}

.card-preview {
  height: 42px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: #fff;
  overflow: hidden;
}

.preview-bar {
  height: 2px;
  border-radius: 1px;
  width: 100%;
}

.preview-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pline {
  display: block;
  height: 2px;
  border-radius: 1px;
}

.pline-title {
  width: 60%;
  opacity: 0.8;
}

.pline-text {
  width: 100%;
  background: #d0d0d0;
  opacity: 0.4;
}

.pline-text.short {
  width: 75%;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 6px;
  border-top: 1px solid #f0f0f0;
}

.card-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-name {
  font-size: 10px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
}

.template-card.active .card-name {
  color: #1890ff;
  font-weight: 600;
}
</style>
