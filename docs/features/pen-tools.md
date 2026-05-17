# 画笔工具

## 功能概述

ViewStage 提供功能完整的画笔工具，支持多色画笔、无级调节线宽、橡皮擦以及高级的钢笔笔锋效果。

## 画笔配置

```javascript
const DRAW_CONFIG = {
    penColor: '#3498db',    // 默认笔色
    penWidth: 5,            // 默认笔宽 (px)
    eraserSize: 15,         // 橡皮大小 (px)
    penEffectMode: 'limited', // 钢笔效果模式
    // ...
};
```

## 颜色系统

- 预设 15 种颜色（红、橙、黄、绿、青、蓝、紫、粉等）
- 支持自定义增删画笔颜色
- 颜色取色器支持 HSV 选择和十六进制输入

## 画笔调节

### 画笔宽度
- 范围：1-20px
- 滑块调节 + 数值显示

### 橡皮擦大小
- 范围：1-50px
- 滑块调节 + 数值显示

## 钢笔笔锋效果

实现位置：`src/main.js`（`RealPenManager` 类）和 `src/batch-draw.js`

### 效果模式

| 模式 | 说明 |
|------|------|
| `off` | 关闭笔锋，均匀线宽 |
| `limited` | 有限效果，适用于一般教学 |
| `full` | 完整效果，适用于精细绘图 |

### 核心算法

1. **速度计算**: 根据指针移动速度动态调整线宽
2. **Catmull-Rom 样条插值**: 平滑笔迹路径
3. **起笔渐变**: 笔画起始 4 段渐入效果
4. **收笔渐变**: 笔画结束 6 段渐出效果
5. **曲面细分**: 使用 `pen_tessellator.js` 构建细分网格

### 线宽计算

```javascript
calc_line_width(baseWidth, velocity, pressure = 0.5) {
    const speedFactor = 1 - eased * 0.75;
    const pressureFactor = 0.85 + (pressure * 0.3);
    return baseWidth * speedFactor * pressureFactor;
}
```
