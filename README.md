# ✍️ wx-art-formatter — 微信公众号排版工具

一个纯前端的微信公众号文章一键排版工具。输入 Markdown 或富文本，选择模板和主题色，一键复制到微信公众号编辑器，完美保留排版样式。

## 功能特性

- **双模式输入** — 支持 Markdown 编辑（CodeMirror 6 语法高亮）和富文本粘贴
- **17 套预设模板** — 涵盖经典、背景、创意三大类风格，开箱即用
- **主题色自定义** — 8 种预设色 + 自定义取色器，一键替换全局主题色
- **实时预览** — 左右分栏布局，右侧手机模拟框实时渲染排版效果
- **宽屏 / 全屏预览** — 支持切换宽屏视图和全屏弹窗预览
- **代码高亮** — 基于 highlight.js，支持主流编程语言语法高亮
- **自动目录生成** — 扫描文章标题，一键插入结构化目录
- **自定义背景图** — 上传背景图片，叠加在模板样式之上
- **一键复制** — 以 `text/html` 格式写入剪贴板，粘贴到微信编辑器即保留全部样式
- **导出长图** — 将排版结果导出为高清 PNG 长图
- **导出 PDF** — 生成 A4 尺寸多页 PDF 文档
- **响应式布局** — 适配桌面和移动端屏幕

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + TypeScript | 框架 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| CodeMirror 6 | Markdown 编辑器 |
| markdown-it | Markdown 解析 |
| highlight.js | 代码语法高亮 |
| html2canvas-pro | 导出长图 |
| jsPDF | 导出 PDF |
| juice | CSS 内联化 |

## 快速开始

```bash
# 克隆项目
git clone <repo-url>
cd wx-formatter

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── main.ts                 # 应用入口
├── App.vue                 # 根组件（左右分栏布局）
├── components/
│   ├── Editor.vue          # 左侧编辑器（Markdown / 富文本切换）
│   ├── Preview.vue         # 右侧预览（手机/宽屏/全屏）
│   ├── Toolbar.vue         # 顶部工具栏
│   ├── TemplateSelector.vue# 模板选择器（分类筛选）
│   ├── ThemeColorPicker.vue# 主题色选择器
│   └── PhoneFrame.vue      # iPhone 模拟框
├── core/
│   ├── renderer.ts         # 排版引擎入口
│   ├── markdown.ts         # markdown-it 配置与自定义渲染器
│   ├── richtext.ts         # 富文本 DOM 遍历样式注入
│   ├── clipboard.ts        # 剪贴板复制
│   ├── export.ts           # 导出长图 / PDF
│   └── toc.ts              # 目录生成
├── themes/
│   ├── types.ts            # ThemeConfig 类型定义
│   ├── index.ts            # 模板注册与导出
│   ├── claude.ts           # Claude 模板（默认）
│   ├── minimal.ts          # 极简
│   ├── tech-blue.ts        # 科技蓝
│   ├── elegant.ts          # 文艺风
│   ├── business.ts         # 商务风
│   ├── fresh-green.ts      # 清新绿
│   ├── rose-pink.ts        # 玫瑰粉
│   ├── gradient-purple.ts  # 渐变紫
│   ├── dark.ts             # 暗色
│   ├── claude-bg.ts        # Claude 带背景
│   ├── letter-paper.ts     # 信纸风
│   ├── sunset-glow.ts      # 日落晚霞
│   ├── china-red.ts        # 中国红
│   ├── morandi.ts          # 莫兰迪
│   ├── mint-forest.ts      # 薄荷森林
│   ├── starry-night.ts     # 星空夜
│   └── cyberpunk.ts        # 赛博朋克
├── stores/
│   └── editor.ts           # Pinia 状态管理
└── styles/
    └── global.css           # 全局样式
```

## 工作原理

微信公众号编辑器会剥离 `<style>` 标签和 CSS class，**只保留元素上的 inline style**。因此本工具的核心设计是：

1. 用户输入 Markdown 或粘贴富文本
2. 排版引擎通过 markdown-it 自定义 renderer（或 DOM 遍历）将模板样式以 `style="..."` 的形式注入到每个 HTML 元素上
3. 用户点击"一键复制"，以 `text/html` 格式写入剪贴板
4. 在微信编辑器中 Ctrl+V 粘贴，排版样式完整保留

## 预设模板一览

| 分类 | 模板 |
|------|------|
| 经典 | Claude、极简、科技蓝、文艺风、商务风、清新绿、玫瑰粉、渐变紫、暗色 |
| 背景 | Claude 带背景、信纸风、日落晚霞、中国红、莫兰迪、薄荷森林、星空夜 |
| 创意 | 赛博朋克 |

## 部署

纯静态项目，构建后 `dist/` 目录可部署到任意静态托管服务：

- Vercel
- GitHub Pages
- Netlify
- Cloudflare Pages
- 或直接本地 `npm run dev` 使用

## License

MIT
