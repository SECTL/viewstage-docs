# 环境搭建

## 系统要求

- **Node.js**: 推荐 20.x 或更高版本
- **Rust**: 稳定版（推荐使用 rustup 安装）
- **Tauri CLI**: 2.0 版本

## 安装步骤

### 1. 安装 Rust

```bash
# 访问 https://rustup.rs/ 或执行：
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. 安装 Tauri CLI

```bash
cargo install tauri-cli --version "^2.0"
```

### 3. 克隆项目

```bash
git clone https://github.com/ospneam/ViewStage.git
cd ViewStage
```

## 运行项目

### 开发模式

```bash
cargo tauri dev
```

### 构建发布

```bash
cargo tauri build
```

## 项目结构

```
ViewStage/
├── src/                    # 前端源码
│   ├── index.html          # 主界面 HTML
│   ├── main.js             # 核心逻辑
│   ├── init.js             # 初始化
│   ├── history.js          # 撤销系统
│   ├── batch-draw.js       # 批量绘制
│   ├── i18n.js             # 国际化
│   ├── pen_tessellator.js  # 笔锋算法
│   ├── styles.css          # 主样式
│   ├── canvas.css          # 画布样式
│   ├── settings.html/css/js # 设置页面
│   ├── oobe.html/css/js    # 首次启动引导
│   ├── splashscreen.html   # 启动屏
│   ├── JS/                 # 第三方 JS 库
│   │   ├── pdf.js          # PDF.js
│   │   ├── canvas.js       # html2canvas
│   │   └── mammoth.browser.min.js
│   ├── locales/            # 国际化语言文件
│   │   ├── zh-CN.json
│   │   ├── zh-TW.json
│   │   └── en-US.json
│   ├── themes/             # 主题系统
│   │   ├── theme.js        # 主题管理器
│   │   ├── simplify/       # 简化主题
│   │   └── dark/           # 深色主题
│   ├── doc-scan/           # 文档扫描
│   └── assets/             # 静态资源
├── src-tauri/              # Rust 后端
│   ├── src/
│   │   ├── main.rs         # 入口
│   │   ├── lib.rs          # 核心逻辑
│   │   └── image_processing.rs
│   ├── Cargo.toml          # Rust 依赖
│   ├── tauri.conf.json     # Tauri 配置
│   └── icons/              # 应用图标
├── model/                  # 模型文件
└── README.md
```

## 常用命令

```bash
# 运行开发服务器
cargo tauri dev

# 构建生产版本
cargo tauri build

# 运行 Rust 测试
cargo test

# 运行 clippy 检查
cargo clippy
```
