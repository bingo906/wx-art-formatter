<template>
  <div class="editor-container">
    <div class="editor-tabs">
      <button
        :class="['tab-btn', { active: store.inputType === 'markdown' }]"
        @click="store.setInputType('markdown')"
      >
        Markdown
      </button>
      <button
        :class="['tab-btn', { active: store.inputType === 'richtext' }]"
        @click="store.setInputType('richtext')"
      >
        富文本粘贴
      </button>
    </div>
    <div class="editor-body">
      <div v-if="store.inputType === 'markdown'" ref="cmContainer" class="cm-wrapper"></div>
      <div
        v-else
        class="richtext-input"
        contenteditable="true"
        @input="onRichtextInput"
        placeholder="在此粘贴富文本内容（从网页、Word 等复制的内容）..."
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useEditorStore } from '../stores/editor'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { languages } from '@codemirror/language-data'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'

const store = useEditorStore()
const cmContainer = ref<HTMLElement>()
let editorView: EditorView | null = null

function createEditor() {
  if (!cmContainer.value) return

  const startState = EditorState.create({
    doc: store.content,
    extensions: [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      markdown({ codeLanguages: languages }),
      syntaxHighlighting(defaultHighlightStyle),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          store.setContent(update.state.doc.toString())
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
        },
        '.cm-scroller': {
          overflow: 'auto',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        },
        '.cm-content': {
          padding: '12px 0',
        },
        '.cm-gutters': {
          background: '#f8f9fa',
          borderRight: '1px solid #e8e8e8',
        },
      }),
    ],
  })

  editorView = new EditorView({
    state: startState,
    parent: cmContainer.value,
  })
}

onMounted(() => {
  if (store.inputType === 'markdown') {
    createEditor()
  }
})

watch(
  () => store.inputType,
  async (newType) => {
    if (newType === 'markdown') {
      await nextTick()
      if (!editorView) {
        createEditor()
      }
    }
  }
)

function onRichtextInput(e: Event) {
  const target = e.target as HTMLElement
  store.setContent(target.innerHTML)
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  padding: 0 8px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: #333;
}

.tab-btn.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  font-weight: 500;
}

.editor-body {
  flex: 1;
  overflow: hidden;
}

.cm-wrapper {
  height: 100%;
}

.cm-wrapper :deep(.cm-editor) {
  height: 100%;
}

.richtext-input {
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.richtext-input:empty::before {
  content: attr(placeholder);
  color: #bbb;
}
</style>
