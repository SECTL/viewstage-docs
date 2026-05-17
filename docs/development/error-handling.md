# 错误处理

ViewStage 采用多层错误处理架构：Rust 后端使用 `Result<T, String>` 统一返回，前端通过 try/catch 捕获并展示自定义弹窗。

## 总体架构

```
Rust 命令 → Result<T, String>
               │
               ▼
JS invoke() → try/catch
               │
               ├─ main_show_error_dialog()  — 主窗口弹窗（含重试）
               ├─ settings_show_dialog()    — 设置窗口弹窗
               ├─ console.error()           — 静默处理
               └─ 前端降级方案              — Rust 失败时使用
```

## Rust 端错误处理

所有 Tauri 命令统一返回 `Result<T, String>`，String 作为错误类型自动转为 JS 异常。

```rust
#[tauri::command]
fn some_command() -> Result<SomeType, String> {
    // 使用 map_err 将错误转为中文友好消息
    let config = std::fs::read_to_string(&path)
        .map_err(|e| format!("读取配置文件失败: {}", e))?;

    let parsed: Value = serde_json::from_str(&config)
        .map_err(|e| format!("解析配置文件失败: {}", e))?;

    Ok(parsed)
}
```

### 错误处理模式

| 模式 | 说明 | 示例 |
|------|------|------|
| `map_err` | 转换错误类型 | `.map_err(\|e\| format!("操作失败: {}", e))?` |
| 友好中文消息 | 错误信息本地化 | `"创建目录失败"`、`"模型文件不存在"` |
| 静默忽略 | 非关键操作 | `let _ = splashscreen.close();` |

## 前端自定义弹窗系统

项目实现了两套完全自定义的弹窗，未使用 Tauri 原生的 `dialog.message()` API。

### 主窗口弹窗 — `main_show_error_dialog`

**文件**: `main.js:4732`

支持重试回调的错误弹窗，用于关键操作失败（如文件导入、PDF 转换）。

```javascript
function main_show_error_dialog(title, message, retryCallback = null)
```

**调用场景** (共 18 处):

| 场景 | 重试支持 |
|------|----------|
| 文件路径解析失败 | 否 |
| Office 检测失败（未安装） | 否 |
| Office 检测异常 | 否 |
| 文件读取失败 | 否 |
| Word 文档转换失败 | 是 |
| PDF.js 库加载超时 | 否 |
| 文件导入失败 | 否 |
| 摄像头未就绪 | 否 |

**HTML 结构**:

```html
<div class="error-dialog-overlay" id="errorDialog">
    <div class="error-dialog">
        <div class="error-icon">⚠️</div>
        <div class="error-title">错误标题</div>
        <div class="error-message">错误详情（pre-wrap 保留换行）</div>
        <div class="error-buttons">
            <button class="error-btn error-btn-retry">重试</button>
            <button class="error-btn error-btn-close">关闭</button>
        </div>
    </div>
</div>
```

### 设置窗口弹窗 — `settings_show_dialog`

**文件**: `settings.js:15`

三种类型的信息弹窗。

```javascript
function settings_show_dialog(title, message, type = 'info')
// type: 'info' | 'error' | 'success'
```

用于设置保存结果、模型下载结果、配置文件导入/导出状态反馈（约 30+ 处调用）。

### 系统对话框使用

| 对话框类型 | 用途 | 调用处 |
|-----------|------|--------|
| `confirm()` | 模型删除确认 | `settings.js:1790`（DBNet）、`:1882`（UVDoc）、`:1973`（DexiNed） |
| `dialog.open()` | 文件选择器（导入配置/模型） | `settings.js`、`oobe.js` |
| `dialog.save()` | 文件保存器（导出配置） | `settings.js` |
| `alert()` | 简单提示（非 Tauri 环境回退） | `doc-scan.js`、`doc-scan-page.js`、`main.js` |

### 模态确认框

**文件**: `settings.html`

用于需要用户确认的破坏性操作。

| 用途 | 说明 |
|------|------|
| 重置应用 | 清除所有设置和缓存 |
| 撤销摄像头权限 | 重置摄像头权限状态 |
| 重启应用提示 | 设置变更后建议重启 |

## 加载遮罩 — `main_show_loading_overlay`

**文件**: `main.js:4705`

长时间操作（如 PDF 导入）的加载状态反馈。

```javascript
function main_show_loading_overlay(message)  // 显示加载遮罩
function main_update_loading_progress(message) // 更新进度文字
function main_hide_loading_overlay()          // 隐藏加载遮罩
```

## 错误分类处理

### 摄像头错误

按错误类型分类处理（`init.js:300`、`main.js:3680`）：

```javascript
catch (error) {
    if (error.name === 'NotFoundError') {
        // 未检测到摄像头 → 进入无摄像头模式
    } else if (error.name === 'NotAllowedError') {
        // 无摄像头权限 → 提示用户授权
    } else {
        // 通用初始化失败
    }
}
```

### Word 转换错误

按错误内容分析原因（`main.js:1158`）：

```javascript
const errorMsg = String(convertError);
if (errorMsg.includes('Office')) {
    friendlyMsg = 'Office 软件调用失败\n可能的原因：\n...';
}
main_show_error_dialog('转换失败', friendlyMsg, retryCallback);
```

## 前端降级方案

当 Rust 后端命令失败时，前端自动尝试使用纯 JS 方案降级。

```javascript
if (window.__TAURI__) {
    try {
        result = await invoke('stroke_format_compact', { request });
    } catch (error) {
        console.error('Rust 笔画压缩失败，使用前端降级方案:', error);
    }
}
// 前端降级处理（纯 Canvas 实现）
```

## 权限配置

```json
{
    "permissions": [
        "dialog:default",
        "dialog:allow-open",
        "dialog:allow-save"
    ]
}
```

注意：未注册 `dialog:allow-message` 或 `dialog:allow-ask`，因为项目使用自定义 HTML/CSS 弹窗替代原生对话框。
