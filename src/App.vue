<template>
  <div class="app">
    <header class="app-header">
      <div class="brand">
        <span class="brand-icon">✍️</span>
        <h1 class="brand-title">微信公众号排版工具</h1>
        <span class="brand-badge">Beta</span>
      </div>
      <div class="header-hint">
        输入 Markdown，选择模板，一键复制到微信公众号编辑器
      </div>
    </header>
    <Toolbar />
    <main class="app-main">
      <div class="panel editor-panel">
        <Editor />
      </div>
      <div class="panel preview-panel">
        <Preview />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import Toolbar from './components/Toolbar.vue'
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  font-size: 22px;
}

.brand-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.brand-badge {
  font-size: 10px;
  background: #1890ff;
  color: #fff;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.header-hint {
  font-size: 12px;
  color: #999;
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.panel {
  flex: 1;
  overflow: hidden;
}

.editor-panel {
  padding: 12px;
  padding-right: 6px;
}

.preview-panel {
  padding: 12px;
  padding-left: 6px;
}

@media (max-width: 768px) {
  .app-main {
    flex-direction: column;
  }

  .editor-panel,
  .preview-panel {
    padding: 8px;
  }

  .header-hint {
    display: none;
  }
}
</style>
