# 项目架构

## 整体架构

ViewStage 采用 **Tauri 2.0** 架构，前端使用原生 Web 技术栈，后端使用 Rust。

```
┌─────────────────────────────────────────┐
│              前端 (WebView2)              │
│  ┌───────────────────────────────────┐  │
│  │    main.js (主逻辑)                │  │
│  │    init.js (初始化)                │  │
│  │    history.js (撤销系统)           │  │
│  │    batch-draw.js (批量绘制)        │  │
│  │    i18n.js (国际化)                │  │
│  │    pen_tessellator.js (笔锋)       │  │
│  │    settings.js (设置)              │  │
│  │    doc-scan/ (文档扫描)            │  │
│  │    themes/ (主题系统)              │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│           IPC (invoke/event)             │
├─────────────────────────────────────────┤
│           后端 (Rust + Tauri)            │
│  ┌───────────────────────────────────┐  │
│  │  lib.rs (核心逻辑)                │  │
│  │  image_processing.rs (图像处理)    │  │
│  │  main.rs (入口)                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 前端架构

### 核心文件说明

| 文件 | 路径 | 功能 |
|------|------|------|
| `index.html` | `src/index.html` | 主界面 HTML 入口 |
| `main.js` | `src/main.js` | 核心逻辑：画笔、画布变换、PDF 加载、源管理 |
| `init.js` | `src/init.js` | 应用初始化：DOM、Canvas、设置加载、摄像头 |
| `history.js` | `src/history.js` | 命令模式实现的撤销/重做系统 |
| `batch-draw.js` | `src/batch-draw.js` | 实时批量绘制管理器，RAF 调度 |
| `i18n.js` | `src/i18n.js` | 国际化系统 |
| `pen_tessellator.js` | `src/pen_tessellator.js` | 钢笔笔锋曲面细分算法 |
| `settings.html/js` | `src/settings.*` | 设置页面 |
| `oobe.html/js` | `src/oobe.*` | 首次运行引导页面 |

### 数据流

```
用户操作 → 事件监听 → main.js (状态更新)
              ↓
      batch-draw.js (RAF批量渲染)
              ↓
      Canvas 2D API (drawCanvas)
              ↓
      (可选) Rust backend (图像保存/处理)
```

## 后端架构

### Rust 模块

| 模块 | 文件 | 功能 |
|------|------|------|
| 核心命令 | `lib.rs` | 系统目录、设置管理、图片保存、笔画压缩、Office 转换、文件关联、更新检查、文档扫描 |
| 图像处理 | `image_processing.rs` | base64 编解码、图像旋转 |

### 关键技术依赖

- **image** / **imageproc**: 图像处理
- **serde** / **serde_json**: 序列化
- **ort**: ONNX Runtime 绑定（AI 推理）
- **reqwest**: HTTP 客户端（更新下载、模型下载）
- **tokio**: 异步运行时
- **chrono**: 日期时间
- **rayon**: 数据并行（未直接使用，通过 image 库间接使用）

## 源 ID 管理系统

ViewStage 支持多种信号源（摄像头、图片、PDF 文档），通过源 ID 系统统一管理每个源的缩放状态和批注数据：

```
源类型:
- 'cam'         → 摄像头（唯一）
- 'pic-{n}'     → 图片
- 'doc-{n}-{m}' → PDF 文档（n=文档编号, m=页码）

每个源独立保存:
- scale（缩放比例）
- canvasX / canvasY（画布偏移）
- strokeHistory（批注历史）
- baseImageURL（基础图片）
```
