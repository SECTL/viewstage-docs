# 后端架构

## 技术选型

ViewStage 后端使用 **Rust** 语言，基于 **Tauri 2.0** 框架。

## Cargo.toml 依赖

```toml
[dependencies]
tauri = { version = "2", features = ["devtools"] }
tauri-plugin-opener = "2"          # 文件打开
tauri-plugin-fs = "2"              # 文件系统
tauri-plugin-dialog = "2"          # 对话框
tauri-plugin-single-instance = "2" # 单实例
tokio = "1"                        # 异步运行时
serde = "1"                        # 序列化
serde_json = "1"                   # JSON
image = "0.25"                     # 图像处理
base64 = "0.22"                    # Base64 编解码
chrono = "0.4"                     # 日期时间
reqwest = "0.11"                   # HTTP 客户端
ort = "2.0.0-rc.10"               # ONNX Runtime
winreg = "0.52"                    # Windows 注册表
dirs = "5"                         # 系统目录
```

## 核心模块

### lib.rs — 核心逻辑 (3004 行)

#### Tauri 命令

**系统目录**
| 命令 | 功能 |
|------|------|
| `dir_fetch_cache` | 获取缓存目录 |
| `dir_fetch_config` | 获取配置目录 |
| `dir_fetch_pictures_viewstage` | 获取图片保存目录 |
| `dir_fetch_theme` | 获取主题目录 |

**缓存管理**
| 命令 | 功能 |
|------|------|
| `cache_fetch_size` | 获取缓存大小 |
| `cache_delete_all` | 清除所有缓存 |
| `cache_validate_auto_clear` | 检查并自动清除缓存 |

**图像处理**
| 命令 | 功能 |
|------|------|
| `image_save_file` | 保存图片文件 |
| `image_update_rotation` | 图片旋转（委托给 `image_processing.rs`）|

**笔画压缩**
| 命令 | 功能 |
|------|------|
| `stroke_format_compact` | 将笔画渲染到图片（支持 draw/erase/clear）|

**设置管理**
| 命令 | 功能 |
|------|------|
| `settings_fetch_all` | 获取所有设置（含配置迁移）|
| `settings_save_all` | 保存设置（原子写入）|
| `settings_delete_all` | 删除所有设置并重启 |

**Office 转换**
| 命令 | 功能 |
|------|------|
| `office_detect_all` | 检测已安装的 Office 软件 |
| `office_convert_docx_to_pdf` | Word 文档转 PDF |
| `office_convert_docx_to_pdf_bytes` | 通过字节数据转换 |

**文件关联**
| 命令 | 功能 |
|------|------|
| `filetype_set_icons` | 注册文件关联和图标 |
| `filetype_delete_icons` | 删除文件关联 |
| `filetype_validate_pdf_default` | 检查 PDF 默认打开方式 |

**文档扫描**
| 命令 | 功能 |
|------|------|
| `scan_process_document` | 完整文档扫描处理 |
| `model_fetch_dbnet_info` | 获取 DBNet 模型信息 |
| `model_download_dbnet` | 下载 DBNet 模型 |

**更新**
| 命令 | 功能 |
|------|------|
| `update_fetch_check` | 检查 GitHub 更新 |
| `update_download_file` | 下载更新文件 |

**窗口**
| 命令 | 功能 |
|------|------|
| `window_show_settings` | 打开设置窗口 |
| `window_show_doc_scan` | 打开文档扫描窗口 |
| `window_hide_splashscreen` | 关闭启动屏 |

### image_processing.rs — 图像处理

- `image_load_base64`: base64 → DynamicImage
- `image_fetch_base64_data`: base64 → 原始字节
- `image_update_rotation`: 图像旋转（90°/270°）

## 配置迁移系统

配置文件支持版本化迁移：

```
config_version: 0 → 1 → 2 (CURRENT_CONFIG_VERSION)
```

迁移自动备份旧配置到 `config.json.backup_v{version}_{timestamp}`

## 日志系统

日志文件路径: `%APPDATA%/SECTL/ViewStage/log/viewstage_{YYYYMMDD}.log`
