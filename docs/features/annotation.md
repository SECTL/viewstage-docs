# 批注系统

## 功能概述

批注系统是 ViewStage 的核心功能之一，支持在摄像头画面、图片或 PDF 页面上进行自由绘制批注。

## 架构设计

### 图层结构

```
canvasContainer
  └── canvasWrapper (CSS transform: translate3d + scale)
      ├── imageElement (图像层 - img)
      ├── cameraVideo (摄像头层 - video)
      └── drawCanvas (批注层 - canvas)
```

### 批注层 (drawCanvas)

- Canvas 2D 上下文，`alpha: true`，`desynchronized: true`（低延迟渲染）
- 尺寸：逻辑尺寸为屏幕尺寸的 2 倍
- DPR 缩放：支持设备像素比

## 撤销/重做系统

实现位置：`src/history.js`

采用**命令模式**设计：

### 命令类型

| 命令 | 说明 |
|------|------|
| `DrawCommand` | 绘制笔画 |
| `EraseCommand` | 橡皮擦除 |
| `PenEraseCommand` | 钢笔效果笔画切割 |
| `ClearCommand` | 清空所有笔画 |
| `SnapshotCommand` | 快照压缩（合并历史） |

### 历史管理器

```javascript
history_state = {
    undo_list: [],    // 撤销栈
    redo_list: [],    // 重做栈
    is_executing: false,
    on_state_change: null
};
```

- 最大历史步数：`MAX_HISTORY_STEPS = 50`
- 软上限触发快照压缩，硬上限 100 步强制裁剪

## 性能优化

### 批量绘制 (batch-draw.js)

使用 `requestAnimationFrame` 批量提交绘制命令，减少重绘次数：

- 自适应帧率（根据绘制负载动态调整 20-60 FPS）
- 命令缓冲合并
- 上下文状态缓存

### 四叉树空间索引 (main.js)

```javascript
class StrokeQuadTree {
    // 用于快速查找与脏区域相交的笔画
    // 优化局部重绘性能
}
```

### 离屏 Canvas 池

复用离屏 Canvas 对象，减少内存分配：
- 池大小：2
- 用于笔画压缩和重绘优化
