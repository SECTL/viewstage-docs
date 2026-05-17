# 主题设计指南

ViewStage 主题设计的核心思路：通过 CSS 变量驱动全局样式，在不修改 HTML 结构的前提下彻底改变应用外观。本指南涵盖从配色到动效的完整设计建议。

## 配色设计

ViewStage 的 `:root` 变量分为五组：背景层、表面层、文字层、语义色、装饰色。各组之间通过合理的明度对比建立视觉层次。

### 层次结构

```
背景层（--color-canvas*）      → 最底层，应用主背景
  └── 表面层（--color-surface*）→ 卡片/面板/按钮背景
      └── 元素层（btn/toolbar） → 操作控件
          └── 文字层（--color-ink/body/muted）→ 最顶层
```

### 设计建议

- **背景到文字至少保持 4.5:1 对比度**（WCAG AA 标准）
- **表面层比背景层深 5-10%**（浅色主题）或**浅 10-15%**（深色主题）以建立层次
- **品牌色只用于交互元素**（选中态、焦点态、链接），不要大面积使用
- **分割线颜色宜淡**，`--color-hairline` 应接近背景色而非文字色

### 推荐色板

**暖色系（舒适阅读）**

```css
/* 主背景 */
--color-canvas: #faf8f5;
--color-canvas-gradient-start: #faf8f5;
--color-canvas-gradient-end: #f0ece4;
/* 表面层 */
--color-surface-card: #f5f1eb;
--color-surface-strong: #e8e2d8;
/* 文字 */
--color-ink: #2c2420;
--color-body: #5c5248;
--color-muted: #8c8278;
/* 强调色 */
--color-brand-accent: #c0392b;
```

**冷色系（科技感）**

```css
--color-canvas: #f0f4f8;
--color-brand-accent: #2563eb;
--color-ink: #1e293b;
--color-body: #475569;
```

**自然系（护眼）**

```css
--color-canvas: #f5f7f0;
--color-brand-accent: #65a30d;
--color-ink: #1c1917;
--color-body: #44403c;
```

### 深色主题特殊处理

深色主题中，白色 SVG 图标需通过 `filter: invert(1)` 反转显示。注意对不需要反转的元素添加覆盖：

```css
/* 所有工具栏图标反转 */
.toolbar-btn img { filter: invert(1) !important; }
/* 侧边栏和菜单中的图标不需要反转（已有额外处理） */
.sidebar-btn .btn-icon img,
.menu-item img,
.sidebar-import-btn img { filter: none !important; }
```

## 图标设计

### SVG 图标规范

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <!-- 路径 -->
</svg>
```

- **viewBox**: 推荐 `0 0 24 24` 或 `0 0 16 16`
- **颜色**: 使用 `stroke="currentColor"` 和 `fill="none"`，让图标继承父元素的文字色
- **描边**: `stroke-width="2"`（24x24）或 `1.5`（16x16）
- **端点**: `stroke-linecap="round" stroke-linejoin="round"` 确保圆角端点
- **深色主题**: 白色背景的图标通过 `filter: invert(1)` 反转为黑，需确保图标路径在白色背景下可见

### 图标风格统一

同主题的图标应保持风格一致：

```svg
<!-- 正确：统一使用 outline 风格 -->
<!-- menu -->
<path d="M3 6h18M3 12h18M3 18h18"/>
<!-- pen -->
<path d="M3 21l3-3 12-12-3-3-12 12-3 3z"/>
<!-- eraser -->
<path d="M3 21h18M8 8l8 8M4 16l12-12 4 4-12 12z"/>

<!-- 错误：混用 fill 和 outline -->
<path d="..." fill="#333"/>  <!-- 实心 -->
<path d="..." stroke="#333"/> <!-- 描边 -->
```

### 图标映射策略

`theme.json` 的 `icons` 字段允许将同一个 SVG 文件映射到多个逻辑图标：

```json
{
    "icons": {
        "settings": "gear",
        "app-settings": "gear",
        "theme-icon": "color",
        "about": "info"
    }
}
```

当逻辑图标名和 SVG 文件名一致时可以省略映射（如 `"pen": "pen"`），主题管理器会自动使用图标名作为文件名。

## 布局与间距

### 间距系统

`--spacing-*` 变量使用 **4px 基准** 的倍增系统：

| 变量 | 计算 | 推荐用途 |
|------|------|----------|
| `--spacing-xxs` | 4px × 1 | 紧凑元素间距 |
| `--spacing-xs` | 4px × 2 | 按钮图标间距、标签间距 |
| `--spacing-sm` | 4px × 3 | 按钮内边距、列表项间距 |
| `--spacing-md` | 4px × 4 | 卡片内边距、段间距 |
| `--spacing-lg` | 4px × 6 | 区域间距、边距 |
| `--spacing-xl` | 4px × 8 | 大区块间距 |
| `--spacing-xxl` | 4px × 12 | 页面级边距 |

如需调整整体的间距密度，只需修改这些变量的值即可。

### 圆角系统

圆角值决定界面的气质：

| 取值 | 感觉 | 适用场景 |
|------|------|----------|
| 2-4px | 严谨、专业 | 工具类应用 |
| 6-12px | 现代、友好 | 默认选择 |
| 16-24px | 柔和、亲和 | 卡片式界面 |
| 9999px | 胶囊 | 开关、标签、徽标 |

设计建议：同一个主题的圆角变化幅度不宜太大（如 `xs=4px` 到 `xl=16px` 即可），避免风格不统一。

## 阴影设计

阴影为界面建立 Z 轴层次，ViewStage 使用三个层级：

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);    /* 默认状态 */
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);   /* 工具栏、弹出面板 */
--shadow-lg: 0 8px 32px rgba(0,0,0,0.12);   /* 模态弹窗、菜单 */
```

设计建议：

- **深色主题中降低阴影不透明度**，因为深色背景上阴影更明显。如 `rgba(0,0,0,0.12)` 可改为 `rgba(0,0,0,0.25)` 但尺寸减半
- **使用两层阴影** 模拟自然光照：一层宽而淡（环境光），一层窄而深（直射光）
- **阴影方向** 保持一致（默认向下），不要混用上和下阴影

```css
/* 双层阴影示例 */
--shadow-md: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06);
```

## 动效设计

ViewStage 中所有动画遵循 **0.15s-0.25s 的缓动时长**，使用 `ease` 缓动函数。

### 时长规范

| 时长 | 用途 | 说明 |
|------|------|------|
| 0.1s | 颜色过渡、悬停态 | 即时反馈，无需跟踪 |
| 0.15s | 按钮 hover、背景色切换 | 默认过渡时长 |
| 0.2s | 面板弹出、菜单滑入 | 中等复杂度动画 |
| 0.25s | 侧边栏展开/收起 | 大范围位置变化 |

### 缓动函数选择

```css
/* 按钮和交互元素 — 快速响应 */
transition: background 0.15s ease;
transition: opacity 0.15s ease;

/* 面板弹出 — 平滑自然 */
transition: all 0.2s ease;

/* 侧边栏展开 — 先快后慢 */
animation: sidebarExpand 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

### 需要动效的元素

- 按钮 hover/active 状态的颜色背景切换
- 面板（画笔控制、设置、文档扫描）的显示/隐藏
- 侧边栏的展开/收起
- 菜单弹出/关闭
- 加载动画（旋转器）
- 错误弹窗出现/消失

### 避免过度动效

- 不要动画化 `width/height/top/left` 等触发重排的属性，改用 `transform` 和 `opacity`
- 不要对 6 个以上元素同时做动画
- 不要使用超过 0.4s 的时长（启动画面除外）

## 字体设计

ViewStage 默认使用 Inter 字体，主题可以修改 `--font-display` 和 `--font-body` 变量。

### 字体选择建议

```css
/* 数字/科技感 */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* 阅读感（中文场景） */
--font-body: 'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', sans-serif;

/* 等宽混排 */
--font-body: 'JetBrains Mono', 'Inter', system-ui, sans-serif;
```

- 标题字体（`--font-display`）和正文字体（`--font-body`）可以不同，但建议保持一致
- 中文字体建议放在英文字体后面（如 `'Inter', 'Microsoft YaHei', sans-serif`），避免英文也使用中文字形
- 系统字体栈优先（`system-ui, -apple-system, sans-serif`），加载最快

## 无障碍设计

### 对比度要求

| 等级 | 普通文字 | 大文字(>18px) | 装饰元素 |
|------|----------|---------------|----------|
| AA（最低） | 4.5:1 | 3:1 | 无要求 |
| AAA（推荐） | 7:1 | 4.5:1 | 3:1 |

### 快速验证

```javascript
// 使用 Chrome DevTools 计算对比度
// 选中元素 → Styles 面板 → Color 旁边的对比度指示器
```

### 聚焦态设计

所有可交互元素应有可见的聚焦样式：

```css
.toolbar-btn:focus-visible {
    outline: 2px solid var(--color-brand-accent);
    outline-offset: 2px;
}
```

## 调试技巧

### 实时预览主题

在设置页面选择主题后，`settings.js` 会调用 `ThemeManager.theme_update_active()` 实时切换。可以通过浏览器 DevTools 检查 CSS 变量是否生效：

```javascript
// 查看当前生效的 CSS 变量
getComputedStyle(document.documentElement).getPropertyValue('--color-canvas')
```

### 常见 CSS 变量覆盖失败原因

```
原因：styles.css 和主题 CSS 都定义在 :root 上，后加载的覆盖先加载的
解决：确保主题 CSS 的 <link> 在 styles.css 之后插入
验证：检查 <head> 中 <link> 的顺序
```

```
原因：!important 标记
解决：检查 styles.css 中是否有 !important 声明，主题中需要同样使用 !important 覆盖
```

```
原因：选择器特异性不足
解决：使用 .toolbar-btn img 而非 img（更高特异性）
```

## 主题核验清单

创建或修改主题后，建议逐一检查以下项目：

- [ ] 工具栏按钮图标正确显示（深色主题已反转）
- [ ] 工具栏 hover/active 状态有视觉反馈
- [ ] 菜单弹出显示正常
- [ ] 侧边栏展开/收起动画流畅
- [ ] 画笔控制面板可见且颜色按钮正常
- [ ] 错误弹窗显示正确
- [ ] 无摄像头提示信息可读
- [ ] 设置页面（`settings.css`）所有元素正常
- [ ] 开关组件正常切换
- [ ] 加载遮罩和加载动画显示正确
- [ ] 文档扫描面板布局正常
- [ ] 滚动条样式一致
- [ ] 所有 `[data-icon]` 元素有对应图标
- [ ] 文字对比度满足 AA 标准
- [ ] 切换 `showToolbarText: true/false` 均工作正常

## 主题示例：自定义渐变主题

以下是一个完整的渐变风格主题设计示例：

### theme.json

```json
{
    "name": "gradient",
    "displayName": "渐变主题",
    "showToolbarText": true,
    "showAuroraEffect": false,
    "canvasBgColor": "#f0f4ff"
}
```

### theme.css（关键片段）

```css
:root {
    --color-canvas: #f0f4ff;
    --color-canvas-gradient-start: #e8f0fe;
    --color-canvas-gradient-end: #f0f4ff;
    --color-primary: #1a237e;
    --color-primary-active: #283593;
    --color-brand-accent: #3f51b5;
    --color-surface-card: #ffffff;
    --color-surface-strong: #e8eaf6;
    --color-hairline: #c5cae9;
    --color-ink: #1a237e;
    --color-body: #3949ab;
    --color-muted: #7986cb;
}

.toolbar-btn.active {
    background: linear-gradient(135deg, #e8eaf6, #c5cae9);
    border-color: var(--color-brand-accent);
}

.loading-spinner {
    border-top-color: var(--color-brand-accent);
}
```
