# 摄像头展台

## 功能概述

ViewStage 的摄像头展台模块负责实时采集摄像头画面，支持拍照保存、画面旋转、镜像切换等功能。

## 核心实现

摄像头功能位于 `src/main.js`，主要管理以下状态：

```javascript
state = {
    cameraStream: null,        // MediaStream 对象
    isCameraOpen: false,       // 摄像头是否开启
    isCameraReady: false,      // 视频是否就绪
    isMirrored: false,         // 是否镜像
    cameraRotation: 0,         // 旋转角度
    useFrontCamera: false,     // 是否使用前置摄像头
    defaultCameraId: null,     // 默认设备 ID
    cameraWidth: 1280,         // 采集宽度
    cameraHeight: 720,         // 采集高度
}
```

## 功能列表

- **摄像头选择**: 支持多摄像头设备切换（前后置）
- **分辨率设置**: 可配置采集分辨率（默认 1280x720）
- **画面镜像**: 支持水平镜像翻转
- **画面旋转**: 支持 90°、180°、270° 旋转
- **拍照保存**: 捕获当前画面并保存到 `~/Pictures/ViewStage/` 目录
- **降噪处理**: 多帧降噪（可配帧数和强度）
- **默认旋转**: 可设置默认旋转角度

## 初始化流程

```
init_camera()
  → getUserMedia({ video: { deviceId, width, height } })
  → 绑定 video 元素
  → 监听 loadedmetadata
  → 开始 cameraAnimationId 循环渲染
```

## 拍照流程

```
拍照按钮 → captureFrame()
  → drawCameraToCanvas()
  → canvas.toBlob()
  → 保存到图片列表 / Rust 后端保存文件
```
