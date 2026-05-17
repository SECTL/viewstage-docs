# PDF/文档展示

## 功能概述

ViewStage 支持导入和展示 PDF 文档以及 Word 文档（.doc/.docx），使用 PDF.js 在浏览器中渲染 PDF，使用 mammoth.js 和 Office COM 接口处理 Word 文档。

## PDF 文档

### 渲染引擎

使用 [PDF.js](https://mozilla.github.io/pdf.js/) 进行 PDF 渲染。

```javascript
// PDF.js 配置（main.js）
pdfjsLib.GlobalWorkerOptions.workerSrc = 'JS/pdf.worker.min.js';
```

### 渲染策略

ViewStage 采用两种渲染策略：

1. **懒加载渲染** (`main_render_pdf_pages_lazy`): 首屏渲染前 N 页，其余页面按需加载
2. **并行批处理渲染** (`main_render_pdf_pages_parallel`): 分批并行渲染，每批 4 页

### PDF 缓存

```javascript
const MAX_PDF_CACHE = 10; // 最多缓存 10 个 PDF 文档对象
```

超过缓存上限时，会自动移除最早的文档并释放 Blob URL。

### 渲染参数

- `pdfScale`: PDF 渲染缩放比例（可在设置中调整，默认 2x）
- 输出格式：JPEG（quality 0.85）
- 每页生成 Blob URL 用于展示

## Word 文档

### 转换流程

Word 文档支持通过以下方式转换：

1. **Microsoft Word**: COM 接口调用 PowerShell 脚本转换
2. **WPS Office**: COM 接口调用 PowerShell 脚本转换
3. **LibreOffice**: 命令行调用 soffice 转换

检测优先级：Word > WPS > LibreOffice

### Office 检测

通过注册表检测已安装的 Office 软件：

```rust
// Rust 后端（lib.rs）
OfficeDetectionResult {
    has_word: bool,
    has_wps: bool,
    has_libreoffice: bool,
    recommended: OfficeSoftware,
}
```

### 转换流程

```
Word 文件 → 读取文件数据 → 调用 Office COM 转换
  → 生成临时 PDF → 缓存到 app cache 目录
  → PDF.js 加载渲染 → 显示
```
