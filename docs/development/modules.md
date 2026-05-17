# 模块详解

## 钢笔笔锋模块 (`pen_tessellator.js`)

实现钢笔效果的曲面细分算法，根据速度和压感动态调整线宽，使用 Catmull-Rom 样条插值平滑笔迹。

核心接口：

```javascript
// 构建笔触细分网格
tessellator_build_stroke_from_stroke_data(stroke, options)

// 渲染细分网格
tessellator_render_stroke(ctx, tessellated_stroke)
```

## 主题系统 (`themes/`)

### 架构

```
themes/
├── theme.js         # 主题管理器
├── simplify/        # 简化主题（默认）
│   └── theme.js
└── dark/            # 深色主题
    └── theme.js
```

### 主题管理器

```javascript
ThemeManager.theme_update_active(themeName)
  → 尝试加载用户自定义主题
  → 回退到内置主题
  → 应用主题（画布背景、颜色等）
```

支持用户自定义主题（位于 `%APPDATA%/SECTL/ViewStage/themes/{name}/`）。

## 国际化系统 (`i18n.js`)

### 支持语言

| 代码 | 语言 |
|------|------|
| `zh-CN` | 简体中文 |
| `zh-TW` | 繁體中文 |
| `en-US` | English |

### 使用方法

HTML 中通过 `data-i18n` 属性绑定：

```html
<span data-i18n="toolbar.move">移动</span>
<button data-i18n-title="rotation.rotateLeft">↺</button>
<input data-i18n-placeholder="common.search">
```

JavaScript 中通过 `format_translate` 获取：

```javascript
i18n.format_translate('loading.processingPage', { current: 1, total: 10 })
// → "正在处理 1/10 页"
```

## 多窗口系统

ViewStage 包含多个窗口：

| 窗口 | URL | 用途 |
|------|-----|------|
| `main` | `index.html` | 主展台界面 |
| `splashscreen` | `splashscreen.html` | 启动画面 |
| `settings` | `settings.html` | 设置窗口 |
| `doc-scan` | `doc-scan/index.html` | 文档扫描窗口 |
| `oobe` | `oobe.html` | 首次运行引导 |

## 单实例管理

使用 `tauri-plugin-single-instance` 确保只能运行一个实例。当第二个实例启动时：

1. 传递文件路径到主实例
2. 发送 `file-opened` 事件
3. 激活并聚焦主窗口

## CSP 安全策略

```json
{
  "security": {
    "csp": "default-src 'self'; connect-src 'self' ipc.localhost: data: blob:; media-src 'self' blob: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; worker-src 'self' blob:;"
  }
}
```

## tauri.conf.json 配置

```json
{
  "productName": "ViewStage",
  "version": "0.15.0",
  "identifier": "SECTL.ViewStage",
  "app": {
    "withGlobalTauri": true,
    "windows": [
      { "label": "main", "fullscreen": true, "decorations": false },
      { "label": "splashscreen", "url": "splashscreen.html" }
    ]
  },
  "bundle": {
    "fileAssociations": [
      { "ext": ["pdf"], "name": "PDF Document" },
      { "ext": ["docx"], "name": "Word Document" },
      { "ext": ["doc"], "name": "Word 97-2003 Document" }
    ]
  }
}
```
