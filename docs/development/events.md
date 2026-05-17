# 事件系统

ViewStage 使用 Tauri 事件系统实现前后端通信和窗口间通信。所有事件通过 `window.__TAURI__.event` API 的 `emit` / `listen` 机制传递。

## 事件总览

| 事件名 | 发送方 | 接收方 | 载荷 | 用途 |
|--------|--------|--------|------|------|
| `splash-progress` | `init.js` | `splashscreen.html` | `{ step, message }` | 启动画面进度更新 |
| `file-opened` | `lib.rs` | `main.js` | `string` (file path) | 单实例文件打开 |
| `settings-changed` | `settings.js` | `main.js` | `string` (key) | 设置变更通知 |
| `theme-changed` | `settings.js` | `main.js` | `string` (theme name) | 主题切换通知 |
| `mirror-changed` | `lib.rs` | `main.js` | `boolean` | 镜像状态变更 |
| `language-changed` | `settings.js` | `main.js` | `string` (locale) | 语言切换通知 |
| `download-progress` | `lib.rs` | `settings.js` | `{ downloaded, total }` | 模型下载进度 |
| `menu-event` | `lib.rs` | `main.js` | `string` (action) | 菜单操作事件 |
| `main-win-focused` | `lib.rs` | `main.js` | `null` | 主窗口聚焦通知 |

## 事件详情

### `splash-progress`

启动画面进度事件，由 `init.js` 在初始化各阶段发送。

**发送方**: `init.js` — `app_emit_splash_progress(step, message)`

```javascript
function app_emit_splash_progress(step, message) {
    window.__TAURI__.event.emit('splash-progress', { step, message });
}
```

**步骤定义**:

| step | 进度 | 描述 |
|------|------|------|
| 0 | 10% | 初始化国际化、DOM、画布 |
| 1 | 30% | 加载设置和缓存 |
| 2 | 50% | 加载主题 |
| 3 | 70% | 初始化摄像头 |
| 4 | 90% | 收尾处理 |
| 5 | 100% | 完成，隐藏启动画面 |

**特殊值**: `step === -1` 用于显示诊断信息。

### `file-opened`

单实例文件打开事件。当用户双击关联文件启动第二个应用实例时，文件路径通过此事件传递给主实例。

**发送方**: `lib.rs` — `tauri-plugin-single-instance` 回调

```rust
// lib.rs
app.on_event(|app, event| {
    if let tauri::RunEvent::Opened { urls } = event {
        // 处理文件打开请求
    }
});
```

**接收方**: `main.js`

```javascript
window.__TAURI__.event.listen('file-opened', (event) => {
    const filePath = event.payload;
    // 解析文件路径并加载
    file_load_file(filePath);
});
```

### `settings-changed`

设置变更通知事件。当设置在 `settings` 窗口中被修改并保存后，通知主窗口刷新对应设置。

```javascript
// settings.js — 发送
await window.__TAURI__.event.emit('settings-changed', settingKey);

// main.js — 接收
window.__TAURI__.event.listen('settings-changed', (event) => {
    const key = event.payload;
    // 根据 key 刷新对应设置
});
```

### `theme-changed`

主题切换通知事件。当用户在设置窗口切换主题后，通知主窗口立即应用新主题。

```javascript
// settings.js — 发送
await window.__TAURI__.event.emit('theme-changed', themeName);

// main.js — 接收  
window.__TAURI__.event.listen('theme-changed', (event) => {
    const themeName = event.payload;
    ThemeManager.theme_update_active(themeName);
});
```

### `mirror-changed`

镜像状态变更事件。由 Rust 端在 `mirror_update_state` 命令中发送。

```rust
// lib.rs
#[tauri::command]
async fn mirror_update_state(enabled: bool, app: tauri::AppHandle) -> Result<(), String> {
    MIRROR_STATE.store(enabled, Ordering::SeqCst);
    app.emit("mirror-changed", enabled)
        .map_err(|e| format!("发送镜像状态事件失败: {}", e))?;
    Ok(())
}
```

### `download-progress`

AI 模型下载进度事件。下载 DBNet / UVDoc 模型时定期发送。

```rust
// lib.rs — 下载循环中
app.emit("download-progress", serde_json::json!({
    "downloaded": downloaded,
    "total": total_size
})).ok();
```

### `menu-event`

系统菜单操作事件。当用户通过菜单触发操作时发送。

```javascript
// main.js — 接收
window.__TAURI__.event.listen('menu-event', (event) => {
    const action = event.payload;
    switch (action) {
        case 'toggle-fullscreen': /* ... */ break;
        case 'show-settings':     /* ... */ break;
        // ...
    }
});
```

### `main-win-focused`

主窗口聚焦事件。当主窗口获得焦点时发送，用于重新初始化摄像头等操作。

## 窗口间通信模式

```
 splashscreen 窗口         main 窗口         settings 窗口
     │                       │                    │
     │  ◄── splash-progress ─┤                    │
     │                       │                    │
     │                       │  ◄── file-opened ──┤ (单实例)
     │                       │                    │
     │                       │  ◄── settings-changed ─┤
     │                       │  ◄── theme-changed ────┤
     │                       │  ◄── language-changed ─┤
     │                       │                    │
     │                       │  ◄── mirror-changed ─┤
     │                       │  ◄── download-progress ┤
```

## Rust 端事件 API

```rust
// 发送事件（向特定窗口）
app.get_webview_window("main")
    .unwrap()
    .emit("event-name", payload)?;

// 发送事件（全局广播）
app.emit("event-name", payload)?;

// 监听事件
app.listen("event-name", |event| {
    let payload = event.payload();
    // 处理事件
});
```

## 前端事件 API

```javascript
// 发送事件
import { emit } from '@tauri-apps/api/event';
await emit('event-name', payload);

// 监听事件
import { listen } from '@tauri-apps/api/event';
const unlisten = await listen('event-name', (event) => {
    const payload = event.payload;
    // 处理事件
});
// 取消监听
unlisten();
```
