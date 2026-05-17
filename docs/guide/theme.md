# 主题系统

## 概述

ViewStage 的主题系统采用**模块化架构**，支持内置主题和用户自定义主题。每个主题是一个独立目录，包含主题配置、样式表和图标集合。

```
themes/
├── theme.js              # 主题管理器（核心引擎，204行）
├── simplify/             # 简化主题（默认）
│   ├── theme.js          # 主题模块 - 导出配置与 API（57行）
│   ├── theme.json        # 主题元数据配置（40行）
│   ├── theme.css         # 主界面样式表（1413行）
│   ├── settings.css      # 设置页面样式表（549行）
│   └── icons/            # SVG 图标集合（26个）
└── dark/                 # 深色主题
    ├── theme.js          # 主题模块（57行）
    ├── theme.json        # 主题元数据配置（40行）
    ├── theme.css         # 主界面样式表（1413行）
    ├── settings.css      # 设置页面样式表（549行）
    └── icons/            # SVG 图标集合（26个，与 simplify 共用文件名）
```

## 架构设计

### 核心原则

- **CSS 变量驱动**：所有颜色、间距、圆角、阴影通过 `:root` 中的 CSS 自定义属性定义，主题 CSS 文件覆盖这些变量
- **模块化加载**：内置主题通过 ES Module `import()` 动态加载，用户主题通过 `convertFileSrc` 加载
- **自动检测页面类型**：自动判断当前页面是主界面还是设置页面，加载对应的 CSS 文件

### 主题管理器状态

```javascript
const ThemeManager = {
    currentTheme: null,         // 当前主题名称（字符串）
    currentThemeModule: null,   // 当前主题模块（对象，含 load_theme 等方法）
    userThemePath: null,        // 用户主题目录路径（从 Rust 后端获取）
    isSettingsPage: false       // 是否为设置页面（影响加载的 CSS）
};
```

### 内置主题 vs 用户主题加载差异

| 特性 | 内置主题 | 用户主题 |
|------|----------|----------|
| 加载方式 | `import(\`./${name}/theme.js\`)` 动态导入 | `fs.readTextFile()` + `convertFileSrc()` |
| CSS 加载 | 通过 `theme.js` 创建 `<link>` 元素 | 同左 |
| `settings.css` | 支持（自动加载） | 不支持 |
| 图标路径 | 相对路径 `../repeat(depth)` | `convertFileSrc()` 转换的绝对路径 |
| `theme.json` 获取 | `fetch()` | `fs.readTextFile()` + `JSON.parse()` |

## 主题管理器 API

### 初始化

```javascript
ThemeManager.init(themeName?)
```
从设置中读取已保存的主题名并加载。若不传参，自动通过 `settings_fetch_all` 获取。

### 核心方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `theme_update_active(name)` | `Promise<void>` | 加载并激活主题（内置动态 import / 用户目录读取 → CSS 注入 → 图标加载） |
| `theme_fetch_current()` | `string` | 返回当前主题名称 |
| `theme_fetch_saved()` | `Promise<string>` | 从设置读取已保存主题（默认 `'simplify'`） |
| `theme_validate_builtin(name)` | `boolean` | 检查是否内置主题（白名单：`['dark', 'simplify']`） |
| `theme_validate_user(dir)` | `Promise<boolean>` | 检查用户主题目录是否存在 `theme.json` |

### 配置查询方法

| 方法 | 返回值 | 默认值 |
|------|--------|--------|
| `theme_fetch_canvas_bg_color()` | `string` (CSS 颜色) | `'#2a2a2a'` |
| `theme_fetch_toolbar_text()` | `boolean` | `true`（显示文字） |
| `theme_fetch_no_camera_style()` | `object` | 见下方 |
| `theme_fetch_aurora_effect()` | `boolean` | `true`（启用极光） |

**`no_camera_style` 默认值：**

```javascript
{
    textColor: '#ffffff',
    secondaryTextColor: 'rgba(255,255,255,0.8)',
    tertiaryTextColor: 'rgba(255,255,255,0.5)',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
}
```

### 图标方法

| 方法 | 说明 |
|------|------|
| `theme_fetch_icon_path(name)` | 返回 SVG 图标的完整路径 |
| `theme_fetch_icon(name, options?)` | 返回 `<img>` HTML 标签字符串（options: width, height, alt, style） |
| `theme_load_icons()` | 扫描所有 `[data-icon]` 元素，自动设置 `src` 属性 |

### 工具栏文字控制

```javascript
ThemeManager.theme_update_toolbar_text_visibility()
```
根据 `theme_fetch_toolbar_text()` 返回值，在 `.toolbar` 元素上添加/移除 `.hide-text` 类。

## 加载流程

```
ThemeManager.init()
  → theme_fetch_saved()            // 从设置获取已保存的主题名
  → theme_update_active(name)
      ├── theme_validate_builtin() // 是否是内置主题？
      │   ├── 是 → 直接动态 import(`./${name}/theme.js`)
      │   └── 否 → theme_validate_user() → theme_load_user()
      ├── currentThemeModule.load_theme(isSettingsPage)
      │   ├── 主界面 → 加载 theme.css
      │   └── 设置页 → 加载 settings.css
      ├── theme_update_toolbar_text_visibility()
      └── theme_load_icons()
          // 扫描 DOM 中的 [data-icon] 元素并设置图标

自动初始化：
  DOMContentLoaded → ThemeManager.init()
```

## theme.json 配置详解

### 所有字段

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | string | 是 | - | 主题标识名，与目录名一致 |
| `displayName` | string | 是 | - | 显示名称，在设置面板中展示 |
| `showToolbarText` | boolean | 否 | `true` | 工具栏按钮是否显示文字标签 |
| `showAuroraEffect` | boolean | 否 | `true` | 设置/关于页面是否显示极光背景动画 |
| `canvasBgColor` | string | 否 | `'#2a2a2a'` | 画布区域背景色 |
| `noCameraMessage` | object | 否 | 见上 | 无摄像头时的提示文字样式 |
| `icons` | object | 是 | - | 图标名称到文件名的映射（26项） |

### icons 字段详解

**键名**：逻辑图标名称，在 HTML 中通过 `data-icon` 或 `theme_fetch_icon()` 引用。

**值**：对应的 SVG 文件名（不含 `.svg` 扩展名）。

完整图标映射表（26 项）：

| 键 | 功能 | 使用位置 |
|----|------|----------|
| `menu` | 汉堡菜单 | `index.html` — 底部工具栏 |
| `minimize` | 最小化/窗口切换 | `index.html` |
| `move` | 移动模式 | `index.html` |
| `pen` | 画笔模式 | `index.html` |
| `eraser` | 橡皮模式 | `index.html` |
| `undo` | 撤销 | `index.html` |
| `clear` | 清屏 | `index.html` |
| `camera` | 摄像头 | `index.html` — 拍照按钮 |
| `camera-fill` | 摄像头切换 | `index.html` — 切换摄像头源 |
| `settings` | 设置 | `index.html` — 打开设置面板 |
| `scan` | 文档扫描 | `index.html` — 打开扫描面板 |
| `image` | 图片导入 | `index.html` — 侧边栏导入按钮 |
| `file` | 文件列表 | `index.html` — 文件侧边栏 |
| `folder` | 文件夹 | `settings.html` — 设置页图标 |
| `close` | 关闭 | `index.html` — 菜单关闭按钮 |
| `collapse` | 折叠 | `index.html` — 侧边栏折叠按钮 |
| `addFile` | 添加文件 | `index.html` — 文件侧边栏 |
| `word` | Word 文档 | `index.html` — 文件列表 |
| `pdf` | PDF 文档 | `index.html` — 文件列表 |
| `app-settings` | 设置页图标 | `settings.html` |
| `doc-scan` | 文档扫描设置 | `settings.html` |
| `canvas` | 画布设置 | `settings.html` |
| `source` | 源管理设置 | `settings.html` |
| `theme-icon` | 主题图标 | `settings.html` |
| `about` | 关于页面 | `settings.html` |

## CSS 变量系统

主题通过定义 `:root` 中的 CSS 自定义属性控制全局样式，这些变量在 `styles.css` 中被 130+ 处引用。

### 颜色变量

| 变量名 | 用途 | Simplify | Dark |
|--------|------|----------|------|
| `--color-canvas` | 主背景色 | `#ffffff` | `#1a1a1a` |
| `--color-canvas-gradient-start` | 背景渐变起点 | `#ffffff` | `#1a1a1a` |
| `--color-canvas-gradient-end` | 背景渐变终点 | `#f8f9fa` | `#2a2a2a` |
| `--color-primary` | 主要文字/元素色 | `#111111` | `#ffffff` |
| `--color-primary-active` | 主要元素激活态 | `#242424` | `#e5e5e5` |
| `--color-brand-accent` | 品牌强调色 | `#3b82f6` | `#3b82f6` |
| `--color-surface-soft` | 软表面背景 | `#f8f9fa` | `#2a2a2a` |
| `--color-surface-card` | 卡片表面背景 | `#f5f5f5` | `#2a2a2a` |
| `--color-surface-strong` | 强表面/hover 态 | `#e5e7eb` | `#3a3a3a` |
| `--color-surface-elevated` | 抬升表面 | `#ffffff` | `#3a3a3a` |
| `--color-hairline` | 分割线 | `#e5e7eb` | `rgba(255,255,255,0.1)` |
| `--color-hairline-soft` | 软分割线 | `#f3f4f6` | `rgba(255,255,255,0.05)` |
| `--color-ink` | 主要文字色 | `#111111` | `#ffffff` |
| `--color-body` | 正文文字色 | `#374151` | `#e5e5e5` |
| `--color-muted` | 弱化文字色 | `#6b7280` | `rgba(255,255,255,0.6)` |
| `--color-muted-soft` | 更弱文字色 | `#898989` | `rgba(255,255,255,0.5)` |
| `--color-on-primary` | 主要元素上的文字色 | `#ffffff` | `#111111` |
| `--color-success` | 成功色 | `#10b981` | `#10b981` |
| `--color-warning` | 警告色 | `#f59e0b` | `#f59e0b` |
| `--color-error` | 错误色 | `#ef4444` | `#ef4444` |

### 圆角变量

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--rounded-xs` | `4px` | 极小圆角 |
| `--rounded-sm` | `6px` | 小圆角 |
| `--rounded-md` | `8px` | 中等圆角（默认按钮） |
| `--rounded-lg` | `12px` | 大圆角（弹窗、工具栏） |
| `--rounded-xl` | `16px` | 特大圆角 |
| `--rounded-pill` | `9999px` | 胶囊圆角（开关滑块） |

### 间距变量

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--spacing-xxs` | `4px` | 极小间距 |
| `--spacing-xs` | `8px` | 小间距 |
| `--spacing-sm` | `12px` | 中间距 |
| `--spacing-md` | `16px` | 中间距 |
| `--spacing-lg` | `24px` | 大间距 |
| `--spacing-xl` | `32px` | 更大间距 |
| `--spacing-xxl` | `48px` | 最大间距 |

### 按钮高度

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--btn-height` | `40px` | 普通按钮 |
| `--btn-height-sm` | `32px` | 小按钮 |
| `--btn-height-lg` | `48px` | 大按钮 |

### 阴影变量（深色/浅色主题值不同）

| 变量名 | Simplify | Dark | 用途 |
|--------|----------|------|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 同 | 轻微阴影 |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | 同 | 中等阴影（工具栏、面板） |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.12)` | 同 | 大阴影（弹窗、菜单） |

### 滚动条变量

| 变量名 | Simplify | Dark |
|--------|----------|------|
| `--scrollbar-track` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` |
| `--scrollbar-thumb` | `rgba(0,0,0,0.2)` | `rgba(255,255,255,0.2)` |
| `--scrollbar-thumb-hover` | `rgba(0,0,0,0.3)` | `rgba(255,255,255,0.3)` |

## 主题生命周期

完整的主题设置 → 应用流程：

```
用户选择主题 (settings.js:1382)
  │
  ▼
settings_save_all_local({ theme: value })
  │
  ├── invoke('settings_save_all')      → Rust 后端持久化到 config.json
  └── emit('settings-changed')          → 通知主窗口
      │
      ▼
main.js (settings-changed 事件监听)
  │
  ├── ThemeManager.theme_update_active(name)
  │   ├── import(`./${name}/theme.js`)   → 加载主题模块
  │   ├── module.load_theme()            → 创建 <link> 注入 CSS
  │   ├── theme_update_toolbar_text_visibility()  → 控制工具栏文字
  │   └── theme_load_icons()             → 更新所有 [data-icon]
  │
  ├── theme_fetch_canvas_bg_color()     → 获取新背景色
  ├── main_update_canvas_bg_color()     → 更新画布背景
  └── theme_fetch_no_camera_style()     → 更新无摄像头提示样式
```

**应用启动时：**

```
splashscreen.html
  ├── invoke('settings_fetch_all') → 读取主题设置
  └── body.classList.add('theme-simplify' / 'theme-dark')

init.js:196
  ├── ThemeManager.theme_update_active(themeName)
  ├── theme_fetch_canvas_bg_color() → 应用到画布
  └── 设置全局 DRAW_CONFIG.canvasBgColor
```

## 主题对所有 UI 组件的影响

| 影响范围 | 实现机制 | 关键代码位置 |
|----------|----------|-------------|
| 画布背景色 | `theme_fetch_canvas_bg_color()` → `main_update_canvas_bg_color()` | `main.js:862`, `init.js:198-200` |
| 工具栏文字显示 | `.toolbar` 添加/移除 `.hide-text` 类 | `theme.js:165-174`, `theme.css:653-661` |
| 无摄像头提示样式 | 动态设置 textColor / textShadow 等 | `main.js:866,5038-5040` |
| 所有 `[data-icon]` 图标 | `theme_load_icons()` 扫描并设置 src | `theme.js:189-195`, `index.html`, `settings.html` |
| 工具栏按钮图标 | `theme_fetch_icon('camera', {...})` 动态生成 | `main.js:3775-3784` |
| 侧边栏按钮图标 | 同上 | `main.js:3969,3990,4195,4243,4257,4277,4450,4786` |
| 菜单图标 | 同上 | `main.js:1683,1687` |
| 文档扫描页面背景 | CSS 变量 `--doc-scan-bg-color`, `--doc-scan-preview-bg` | `doc-scan-page.js:79-81` |
| 关于页面极光效果 | `theme_fetch_aurora_effect()` 控制动画 | `settings.js:2136-2143` |
| 启动屏背景 | body 类名 `theme-simplify` / `theme-dark` | `splashscreen.html:181-188` |
| 设置页面样式 | `settings.css` 独立加载 | `settings.html` |
| OOBE 实时预览 | 选择主题时立即调用 `theme_update_active()` | `oobe.js:324-327` |
| 全局 CSS 变量 | `:root` 中的 `--color-*`, `--spacing-*` 等 | `styles.css:1-49`（130+ 处引用） |

## 内置主题对比

### 简化主题 (simplify) — 默认

| 属性 | 值 |
|------|-----|
| 画布背景色 | `#ffffff` |
| 显示工具栏文字 | 否（`showToolbarText: false`） |
| 极光效果 | 否（`showAuroraEffect: false`） |
| 图标滤镜 | 无（正常显示） |
| 加载遮罩背景 | `rgba(255, 255, 255, 0.9)` |
| 开关选中色 | `--color-primary`（`#111111`） |

### 深色主题 (dark)

| 属性 | 值 |
|------|-----|
| 画布背景色 | `#1a1a1a` |
| 显示工具栏文字 | 否（`showToolbarText: false`） |
| 极光效果 | 否（`showAuroraEffect: false`） |
| 图标滤镜 | `.toolbar-btn img { filter: invert(1) !important }` |
| 加载遮罩背景 | `rgba(26, 26, 26, 0.9)` |
| 开关选中色 | `--color-brand-accent`（`#3b82f6`） |

### 关键 CSS 差异

深色主题相比简化主题的主要差异：

1. **颜色值反转** — 所有 `--color-*` 变量使用浅色值（`#ffffff` 系）替代深色值（`#111111` 系）
2. **分割线** — `--color-hairline` 使用 `rgba(255,255,255,0.1)` 半透明而非实色
3. **图标反转** — `.toolbar-btn img` 和 `.sidebar-import-btn img` 等元素添加 `filter: invert(1) !important`
4. **例外过滤** — `.sidebar-btn .btn-icon img`、`.menu-item img` 等添加 `filter: none !important` 覆盖反转
5. **开关颜色** — `toggle-switch input:checked + .toggle-slider` 使用 `--color-brand-accent` 而非 `--color-primary`

## CSS 组件对照

| CSS 类名 | 组件 | 说明 |
|----------|------|------|
| `.toolbar` | 主工具栏 | 底部工具栏容器，`bottom: 10px` |
| `.toolbar-left/center/right` | 工具栏段 | 三段式布局，center 绝对定位居中 |
| `.toolbar-btn` | 工具栏按钮 | `40x40px`，flex 列布局，带 gap |
| `.toolbar-btn.active` | 激活态按钮 | 当前选中的模式按钮 |
| `.toolbar.hide-text` | 无文字工具栏 | 按钮缩小为 `36x36px`，文字 span 隐藏 |
| `.toolbar-separator` | 分割线 | 1px 宽，24px 高 |
| `.sidebar` | 侧边栏 | `width: 180px`，右侧弹出 |
| `.sidebar.file-sidebar` | 文件侧边栏 | `width: 220px` |
| `.sidebar-image-item` | 图片项 | 16:9 缩略图，hover 显示蓝色边框 |
| `.sidebar-image-item.active` | 激活图片项 | 蓝色边框 + box-shadow 光晕 |
| `.sidebar-folder-item` | 文件夹项 | 横向 flex 布局 |
| `.sidebar-import-btn` | 导入按钮 | 底部导入按钮，hover 蓝色边框 |
| `.sidebar-btn` | 侧边栏按钮 | 全宽按钮，带图标和文字 |
| `.sidebar-btn.active` | 激活按钮 | 蓝色背景 |
| `.sidebar-page-label` | 页码角标 | 图片底部居中的页码标签 |
| `.sidebar-btn-delete` | 删除按钮 | `24x24px` 红色按钮 |
| `.pen-control-panel` | 画笔控制面板 | 弹出面板，`visible` 类控制显隐 |
| `.pen-color-btn` | 颜色按钮 | `24x24px` 圆形，grid 布局 5x3 |
| `.pen-color-btn.active` | 激活颜色 | 白色描边 + 外发光 |
| `.slider-wrapper` | 滑块容器 | `40x50px`，`cursor: ns-resize` |
| `.triangle-track` | 三角滑块轨道 | SVG 三角形背景 |
| `.custom-thumb` | 滑块把手 | `18x18px` 圆形，白色描边 |
| `.settings-panel` | 设置面板 | 摄像头旋转设置弹出面板 |
| `.doc-scan-panel` | 文档扫描面板 | 底部右侧弹出，`bottom: 90px` |
| `.doc-scan-option` | 扫描复选框 | checkbox + label 行 |
| `.menu-popup` | 菜单弹出 | 底部左侧弹出，`menuSlideUp` 动画 |
| `.menu-item` | 菜单项 | 卡片式列表项，hover 高亮 |
| `.loading-overlay` | 加载遮罩 | 全屏覆盖，半透明背景 |
| `.loading-spinner` | 加载旋转器 | 3px 圆环旋转动画 |
| `.error-dialog-overlay` | 错误弹窗遮罩 | `z-index: 10000`，半透明黑色背景 |
| `.error-dialog` | 错误弹窗卡片 | 圆角毛玻璃卡片 |
| `.error-btn-retry` | 重试按钮 | 蓝色品牌色背景 |
| `.error-btn-close` | 关闭按钮 | 灰色背景 |
| `.toggle-switch` | 开关 | `44x24px`，圆角滑块 |
| `.btn-primary` | 主要按钮 | 纯色填充，`--color-primary` |
| `.btn-secondary` | 次要按钮 | 白色背景，1px 边框 |
| `.btn-icon` | 图标按钮 | `36x36px` 圆形 |
| `.btn-text` | 文字按钮 | 透明背景，纯文字 |
| `.btn-sm` | 小按钮 | `32px` 高度 |
| `.btn-lg` | 大按钮 | `48px` 高度 |
| `.btn-danger` | 危险按钮 | 红色背景 |
| `.btn-success` | 成功按钮 | 绿色背景 |
| `.btn-action` | 操作按钮 | 蓝色半透明背景 |
| `.btn-reset` | 重置按钮 | 红色半透明背景 |
| `.btn-close` | 关闭按钮 | 透明背景，hover 变红圆形 |
| `.modal-btn-confirm` | 模态确认按钮 | 红色背景 |
| `.modal-btn-cancel` | 模态取消按钮 | 灰色背景 |

## 动画关键帧

| 动画名 | 触发 | 说明 |
|--------|------|------|
| `sidebarExpand` | 侧边栏打开 | `translateX(20px) scale(0.95) → translateX(0) scale(1)`，0.25s cubic-bezier |
| `sidebarCollapse` | 侧边栏关闭 | 反向动画 |
| `menuSlideUp` | 菜单弹出 | `translateY(10px) → translateY(0)`，0.2s ease |
| `fadeIn` | 启动画面 | `opacity 0 + translateY(8px) → opacity 1 + translateY(0)`，0.4s |

## 创建内置主题

内置主题位于 `src/themes/{name}/` 目录，需要 5 个文件：

```
themes/{name}/
├── theme.js        # 主题模块（必需）
├── theme.json      # 主题配置（必需）
├── theme.css       # 主界面样式（必需）
├── settings.css    # 设置页面样式（可选，无则使用主样式）
└── icons/          # SVG 图标集合（必需，26个）
```

### 1. `theme.json` — 主题配置

```json
{
  "name": "my-theme",
  "displayName": "我的主题",
  "showToolbarText": false,
  "showAuroraEffect": false,
  "canvasBgColor": "#ffffff",
  "noCameraMessage": {
    "textColor": "#1a1a1a",
    "secondaryTextColor": "rgba(0,0,0,0.6)",
    "tertiaryTextColor": "rgba(0,0,0,0.4)",
    "textShadow": "0 1px 3px rgba(255,255,255,0.5)"
  },
  "icons": {
    "menu": "justify",
    "pen": "pen",
    "eraser": "eraser",
    "camera": "camera",
    "settings": "gear",
    "image": "file-earmark-medical",
    "file": "File",
    "folder": "folder",
    "close": "arrow-bar-left",
    "collapse": "caret-down-fill"
  }
}
```

### 2. `theme.js` — 主题模块

每个内置主题必须导出一个包含以下方法的对象：

```javascript
const MyTheme = {
  name: 'my-theme',
  config: null,

  fetch_base_path() {
    const parts = window.location.pathname.split('/').filter(p => p);
    const depth = Math.max(0, parts.length - 1);
    return '../'.repeat(depth);
  },

  // ★ 必需：加载主题（CSS 注入）
  async load_theme(isSettingsPage = false) {
    const base = this.fetch_base_path();
    const response = await fetch(`${base}themes/my-theme/theme.json`);
    this.config = await response.json();
    if (isSettingsPage) {
      // 设置页面加载 settings.css
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${base}themes/my-theme/settings.css`;
      document.head.appendChild(link);
    } else {
      // 主界面加载 theme.css
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${base}themes/my-theme/theme.css`;
      document.head.appendChild(link);
    }
  },

  // ★ 必需：获取图标路径
  fetch_icon_path(iconName) {
    const actualName = this.config?.icons?.[iconName] || iconName;
    const base = this.fetch_base_path();
    return `${base}themes/my-theme/icons/${actualName}.svg`;
  },

  // 获取工具栏文字显示
  fetch_toolbar_text() {
    return this.config?.showToolbarText !== false;
  },

  // 获取画布背景色
  fetch_canvas_bg_color() {
    return this.config?.canvasBgColor || '#ffffff';
  },

  // 获取无摄像头提示样式
  fetch_no_camera_style() {
    return this.config?.noCameraMessage || {
      textColor: '#1a1a1a',
      secondaryTextColor: 'rgba(0,0,0,0.6)',
      tertiaryTextColor: 'rgba(0,0,0,0.4)',
      textShadow: '0 1px 3px rgba(255,255,255,0.5)'
    };
  },

  // 获取极光效果
  fetch_aurora_effect() {
    return this.config?.showAuroraEffect !== false;
  }
};

export default MyTheme;
```

### 3. `theme.css` / `settings.css` — 样式表

**theme.css** 只覆盖部分或全部 `:root` CSS 变量，styles.css 中的 130+ 处引用会自动适配。必须定义所有 `--color-*`、`--rounded-*`、`--spacing-*`、`--shadow-*` 变量。

**settings.css** 结构与 theme.css 相同但只用于设置页面。

### 4. `icons/` — SVG 图标

每个主题必须有完整的 `icons/` 目录，包含 26 个 SVG 图标文件（与 `theme.json` 中 `icons` 字段的值对应）。可直接从简化主题复制或使用自定义 SVG。

SVG 要求：
- 标准 SVG 格式
- 建议 16x16 或 24x24 viewBox
- 使用 `currentColor` 以支持动态着色
- 深色主题中白色图标需使用 `filter: invert(1)` 反转

### 5. 注册内置主题

修改 `src/themes/theme.js:72-75`：

```javascript
theme_validate_builtin(themeName) {
    const builtInThemes = ['dark', 'simplify', 'your-new-theme'];
    return builtInThemes.includes(themeName);
},
```

## 创建自定义主题（用户级）

用户可以在不修改应用文件的情况下创建自定义主题。

### 目录位置

```
%APPDATA%/SECTL/ViewStage/themes/{theme_name}/
```

Windows: `C:\Users\{用户名}\AppData\Roaming\SECTL\ViewStage\themes\{theme_name}\`

### 必需文件

```
themes/{theme_name}/
├── theme.json        # 主题配置（必需）
├── theme.css         # 主界面样式（必需）
└── icons/            # 图标集合（可选，缺少的图标使用默认图标）
    ├── move.svg
    └── ...
```

### 加载原理

```
theme_update_active('my-custom-theme')
  → theme_validate_builtin('my-custom-theme')  // false
  → dir_fetch_theme → 获取用户主题目录
  → theme_validate_user(themeDir)               // 检查 theme.json 是否存在
  → theme_load_user(themeDir, themeName)         // 加载自定义主题
      → fs.readTextFile('{themeDir}/theme.json')
      → 生成临时主题模块对象
      → load_theme() → convertFileSrc() → 创建 <link> 加载 CSS
```

### 限制

- 不支持 `settings.css`，设置页面始终使用当前内置主题的样式
- 图标映射可选，未配置的图标使用系统默认图标
- 仅支持 CSS 样式覆盖，不支持 JavaScript 逻辑扩展
- 主题选择后需重启应用才能完全生效

## 常见问题

### 图标全白（深色主题）

深色主题中 SVG 图标默认通过 `.toolbar-btn img { filter: invert(1) !important }` 反转。若某些图标不需要反转，添加 `filter: none !important`：

```css
.sidebar-btn .btn-icon img {
    filter: none !important;
}
```

### 设置页面主题不生效

设置页面使用 `settings.css` 而非 `theme.css`。自定义主题不支持 `settings.css`，设置页面始终使用内置主题样式。

### 主题选择后需要重启

当前设计中，主题变更会触发重启提示（`restartModal`），因为部分组件（如摄像头预览）在初始化时读取主题样式，无法热更新。设置页面的 `document.documentElement.style.cssText` 方式仅做预览。

### CSS 变量未生效

主题 CSS 的 `:root` 规则优先级低于 `styles.css` 中的 `:root` 规则。确保主题 CSS 在 `styles.css` 之后加载（`<link>` 动态追加到 `<head>` 末尾）。若需覆盖，使用相同选择器声明或提高特异性。
