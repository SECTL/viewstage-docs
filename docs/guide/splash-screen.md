# 启动画面

ViewStage 在应用启动时显示闪屏窗口，展示应用 Logo 和加载进度。启动画面由 `splashscreen` 窗口承载，通过 Tauri 事件系统接收主窗口的初始化进度。

## 窗口配置

`splashscreen` 窗口在 `tauri.conf.json` 中预定义：

```json
{
    "label": "splashscreen",
    "url": "splashscreen.html",
    "width": 400,
    "height": 250,
    "decorations": false,
    "center": true,
    "alwaysOnTop": true,
    "visible": true
}
```

`main` 窗口初始为隐藏状态（`"visible": false`），待加载完成后由启动画面控制显示。

## 加载流程

```
应用启动
  │
  ▼
splashscreen 窗口自动打开 (splashscreen.html)
  │
  ├─ 显示 Logo（fadeIn 动画 0.4s）
  ├─ 显示标题 "ViewStage"（fadeIn 动画 0.4s，延时 0.1s）
  ├─ 显示进度条和加载文字（fadeIn 动画 0.4s，延时 0.2s）
  ├─ 设置初始进度 step=0 (10% — "正在初始化...")
  ├─ splash_load_theme() — 获取设置并应用主题
  └─ 注册 splash-progress 事件监听
  │
  ▼
index.html 加载 (main 窗口，不可见)
  │
  ├─ main_signal_loaded() — 标记脚本加载完成
  └─ import 各模块 (theme.js, pen_tessellator.js, main.js, init.js)
  │
  ▼
init.js → main_init_all()
  │
  ├─ step 0 (10%) — 初始化: i18n, DOM, Canvas, 事件
  ├─ step 1 (30%) — 加载设置和缓存
  ├─ step 2 (50%) — 加载主题
  ├─ step 3 (70%) — 初始化摄像头
  ├─ step 4 (90%) — 收尾处理
  ├─ step 5 (100%) — 完成
  │
  ▼
window_hide_splashscreen() — Rust 命令
  │
  ├─ splashscreen.close() — 关闭闪屏窗口
  ├─ main_window.show()   — 显示主窗口
  └─ main_window.set_focus() — 主窗口获得焦点
```

## 诊断机制

启动画面内置 5 秒诊断定时器：

- `main_check_loaded()` 检查主窗口脚本是否已加载
- 若未加载，显示红色诊断文字：`"诊断：主窗口脚本未加载，检查控制台错误"`
- 300ms 后备定时器：若 300ms 内未收到进度事件，自动推进到 step=1

## 关键实现

### splashscreen.html

所有样式和逻辑内联在 HTML 文件中，无外部 CSS/JS 依赖。

### 进度事件

由 `init.js` 中的 `app_emit_splash_progress(step, message)` 发送，载荷格式：

```typescript
{
    step: number;    // 0-5 进度步骤，-1 为诊断信息
    message: string; // 当前步骤的本地化文字
}
```

### 加载步骤

| step | progress | 默认文字 | 说明 |
|------|----------|---------|------|
| 0 | 10% | 正在初始化... | 国际化、DOM、画布、事件 |
| 1 | 30% | 正在加载设置... | 设置和缓存 |
| 2 | 50% | 正在加载主题... | 主题系统 |
| 3 | 70% | 正在初始化摄像头... | 摄像头枚举和初始化 |
| 4 | 90% | 正在完成... | 收尾处理 |
| 5 | 100% | (空) | 完成，关闭闪屏 |

### Rust 命令

| 命令 | 功能 |
|------|------|
| `main_signal_loaded()` | 标记主窗口脚本已加载（AtomicBool = true） |
| `main_check_loaded() → bool` | 检查主窗口脚本是否已加载 |
| `window_hide_splashscreen()` | 关闭闪屏，显示主窗口 |

### 首次运行（OOBE）特殊路径

当首次运行时，Rust `setup()` 回调检测到 `config.json` 不存在：

1. `OOBE_ACTIVE = true`
2. 动态创建 `oobe` 窗口
3. 立即关闭 `splashscreen` 窗口
4. 前端 `main_init_all()` 检测到 OOBE 激活后直接返回，不继续初始化
