# 前端架构

## 技术选型

ViewStage 前端采用**纯原生技术栈**，不依赖任何前端框架：

- **HTML5**: 语义化标签，ES Modules
- **CSS3**: Flexbox、Grid、CSS 变量、动画
- **JavaScript**: ES2020+，ES Modules，原生 Canvas 2D API

## 核心文件详解

### main.js — 主逻辑

约 3000 行代码，包含：

- **全局配置** (`DRAW_CONFIG`): 画笔参数、画布尺寸、缩放限制
- **全局状态** (`state`): 模式状态、画布变换、摄像头、批注历史
- **`RealPenManager`**: 钢笔笔锋效果管理器
- **`StrokeQuadTree`**: 四叉树空间索引（局部重绘优化）
- **源 ID 管理系统**: 统一管理多源缩放和批注数据
- **PDF 渲染**: 懒加载 + 并行批处理渲染
- **Office 文档转换**: Word → PDF 转换流程
- **事件监听**: 文件打开、设置变更、窗口事件

### init.js — 初始化

应用启动的入口模块：

1. 加载国际化
2. 检查 OOBE 状态
3. 初始化 DOM 元素
4. 初始化 Canvas
5. 初始化历史管理器
6. 绑定事件
7. 加载设置
8. 初始化摄像头
9. 关闭启动屏

### history.js — 撤销系统

命令模式实现：

- `Command` 基类
- `DrawCommand`、`EraseCommand`、`PenEraseCommand`
- `ClearCommand`、`SnapshotCommand`
- `HistoryManager` 管理 undo/redo 栈

### batch-draw.js — 批量绘制

`RealtimeBatchDrawManager` 类：

- **RAF 调度**: 使用 `requestAnimationFrame` 合并绘制命令
- **自适应帧率**: 根据绘制负载动态调节（20-60 FPS）
- **笔锋实时计算**: 速度采样、线宽插值、起笔/收笔渐变
- **上下文缓存**: 减少 Canvas 状态切换

### i18n.js — 国际化

轻量级国际化系统：

- 基于 JSON 语言文件
- `data-i18n` 属性绑定
- 参数插值支持 (`{key}`)
- 自动保存语言偏好到设置

## 画布体系

### 图层

| 元素 | ID | 用途 |
|------|----|------|
| `img` | `imageElement` | 显示静态图片/PDF 页 |
| `video` | `cameraVideo` | 摄像头实时画面 |
| `canvas` | `drawCanvas` | 批注绘制层 |

### 变换系统

使用 CSS `transform: translate3d() scale()` 实现：

- `main_update_transform_schedule`: RAF 调度变换更新
- `main_fetch_safe_scale`: 安全缩放值获取
- 移动边界计算 (`moveBound`)

## 性能优化策略

1. **批量处理**: RAF 批量绘制减少重绘次数
2. **内存优化**: 使用 Blob URL 替代 Data URL 存储图片
3. **离屏 Canvas 池**: 复用离屏 Canvas，减少内存分配
4. **四叉树索引**: 空间索引加速笔画查询
5. **自适应帧率**: 根据负载动态调整帧率
6. **PDF 懒加载**: 按需加载 PDF 页面
