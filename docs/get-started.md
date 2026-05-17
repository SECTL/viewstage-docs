# 快速入门

## 系统要求

### 操作系统
- **Windows**: Windows 10 或更高版本
- **运行时**: WebView2 运行时（[下载地址](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)）

### 硬件要求
- **摄像头**: 支持视频采集的摄像头设备（用于展台功能）
- **内存**: 建议 4GB 以上
- **存储**: 约 50MB 可用空间

### 可选依赖
- **Microsoft Office** 或 **WPS Office**: 用于打开 Word 文档（.doc/.docx）

## 下载安装

从 [GitHub Releases](https://github.com/ospneam/ViewStage/releases) 下载最新版本的安装包，运行安装即可。

> 安装过程中会提示安装 WebView2 运行时（如未安装），请按提示完成安装。

## 首次启动

1. 启动应用后，会先显示 OOBE 引导界面
2. 选择语言（简体中文 / 繁體中文 / English）
3. 完成基本设置后，应用将自动重启并进入主界面

## 开发环境搭建

### 安装依赖

```bash
# Node.js（推荐 20.x）
# Rust（稳定版）
# Tauri CLI

cargo install tauri-cli --version "^2.0"
```

### 克隆并运行

```bash
git clone https://github.com/ospneam/ViewStage.git
cd ViewStage

# 开发模式运行
cargo tauri dev

# 构建发布
cargo tauri build
```

## 主界面布局

```
┌──────────────────────────────────────────────┐
│              画布区域 (Canvas)                 │
│  ┌────────────────────────────────────────┐  │
│  │ 图像层 (imageElement)                   │  │
│  │ 批注层 (drawCanvas)                     │  │
│  │ 摄像头层 (cameraVideo)                  │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  工具栏 (Toolbar)                             │
│  移动 │ 批注 │ 橡皮 │ 撤销 │ 清空 │ 拍照 ... │
└──────────────────────────────────────────────┘
```
