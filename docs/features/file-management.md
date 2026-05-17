# 文件管理

## 源 ID 管理系统

ViewStage 采用统一的**源 ID 系统**管理所有信号源（摄像头、图片、PDF 文档），确保切换时保持每个源的独立状态。

### 源 ID 生成

```javascript
main_create_source_id(type, pageIndex)
// type: 'cam' | 'pic' | 'doc'
// 示例: 'cam', 'pic-1', 'doc-2-3'
```

### 源数据存储

每个源独立保存以下数据：

```javascript
sourceDataStore[sourceId] = {
    scale: number,           // 缩放比例
    canvasX: number,         // 画布 X 偏移
    canvasY: number,         // 画布 Y 偏移
    strokeHistory: [],       // 批注历史
    baseImageURL: string,    // 基础图片
    timestamp: number,       // 最后访问时间
};
```

### 缓存管理

- 最大缓存源数：`MAX_SOURCE_CACHE = 50`
- 超限时自动移除最旧的源数据

## 图片管理

- 支持导入图片到图片列表
- 拍照自动添加到图片列表
- 图片旋转（90°/270°，通过 Rust 后端处理）
- 图片列表侧边栏展示

## PDF 文件管理

- 文件列表侧边栏
- 文件夹按文档名称组织
- 每页独立管理（源 ID + 页码）
- 懒加载 + 并行预渲染
- 翻页自动切换源数据

## 文件关联

ViewStage 支持注册为 PDF 和 Word 文档的默认打开程序：

- **注册**: 创建 ProgID → 关联扩展名 → 设置 UserChoice（Windows 注册表）
- **取消**: 删除注册表项
- **图标**: 注册文件类型图标

## 保存路径

拍照和截图保存到 `~/Pictures/ViewStage/`：

```
~/Pictures/ViewStage/
  └── YYYY-MM-DD/
      ├── photo_HH-MM-SS-mmm.jpg
      └── annotation_HH-MM-SS-mmm.png
```

## 缓存管理

缓存目录位于 `%APPDATA%/SECTL/ViewStage/cache/`：

- 自动清除缓存（可配置天数，默认 15 天）
- 手动清除缓存
- 查看缓存大小
