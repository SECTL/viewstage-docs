<template><div><h1 id="前端架构" tabindex="-1"><a class="header-anchor" href="#前端架构"><span>前端架构</span></a></h1>
<h2 id="技术选型" tabindex="-1"><a class="header-anchor" href="#技术选型"><span>技术选型</span></a></h2>
<p>ViewStage 前端采用<strong>纯原生技术栈</strong>，不依赖任何前端框架：</p>
<ul>
<li><strong>HTML5</strong>: 语义化标签，ES Modules</li>
<li><strong>CSS3</strong>: Flexbox、Grid、CSS 变量、动画</li>
<li><strong>JavaScript</strong>: ES2020+，ES Modules，原生 Canvas 2D API</li>
</ul>
<h2 id="核心文件详解" tabindex="-1"><a class="header-anchor" href="#核心文件详解"><span>核心文件详解</span></a></h2>
<h3 id="main-js-—-主逻辑" tabindex="-1"><a class="header-anchor" href="#main-js-—-主逻辑"><span>main.js — 主逻辑</span></a></h3>
<p>约 3000 行代码，包含：</p>
<ul>
<li><strong>全局配置</strong> (<code v-pre>DRAW_CONFIG</code>): 画笔参数、画布尺寸、缩放限制</li>
<li><strong>全局状态</strong> (<code v-pre>state</code>): 模式状态、画布变换、摄像头、批注历史</li>
<li><strong><code v-pre>RealPenManager</code></strong>: 钢笔笔锋效果管理器</li>
<li><strong><code v-pre>StrokeQuadTree</code></strong>: 四叉树空间索引（局部重绘优化）</li>
<li><strong>源 ID 管理系统</strong>: 统一管理多源缩放和批注数据</li>
<li><strong>PDF 渲染</strong>: 懒加载 + 并行批处理渲染</li>
<li><strong>Office 文档转换</strong>: Word → PDF 转换流程</li>
<li><strong>事件监听</strong>: 文件打开、设置变更、窗口事件</li>
</ul>
<h3 id="init-js-—-初始化" tabindex="-1"><a class="header-anchor" href="#init-js-—-初始化"><span>init.js — 初始化</span></a></h3>
<p>应用启动的入口模块：</p>
<ol>
<li>加载国际化</li>
<li>检查 OOBE 状态</li>
<li>初始化 DOM 元素</li>
<li>初始化 Canvas</li>
<li>初始化历史管理器</li>
<li>绑定事件</li>
<li>加载设置</li>
<li>初始化摄像头</li>
<li>关闭启动屏</li>
</ol>
<h3 id="history-js-—-撤销系统" tabindex="-1"><a class="header-anchor" href="#history-js-—-撤销系统"><span>history.js — 撤销系统</span></a></h3>
<p>命令模式实现：</p>
<ul>
<li><code v-pre>Command</code> 基类</li>
<li><code v-pre>DrawCommand</code>、<code v-pre>EraseCommand</code>、<code v-pre>PenEraseCommand</code></li>
<li><code v-pre>ClearCommand</code>、<code v-pre>SnapshotCommand</code></li>
<li><code v-pre>HistoryManager</code> 管理 undo/redo 栈</li>
</ul>
<h3 id="batch-draw-js-—-批量绘制" tabindex="-1"><a class="header-anchor" href="#batch-draw-js-—-批量绘制"><span>batch-draw.js — 批量绘制</span></a></h3>
<p><code v-pre>RealtimeBatchDrawManager</code> 类：</p>
<ul>
<li><strong>RAF 调度</strong>: 使用 <code v-pre>requestAnimationFrame</code> 合并绘制命令</li>
<li><strong>自适应帧率</strong>: 根据绘制负载动态调节（20-60 FPS）</li>
<li><strong>笔锋实时计算</strong>: 速度采样、线宽插值、起笔/收笔渐变</li>
<li><strong>上下文缓存</strong>: 减少 Canvas 状态切换</li>
</ul>
<h3 id="i18n-js-—-国际化" tabindex="-1"><a class="header-anchor" href="#i18n-js-—-国际化"><span>i18n.js — 国际化</span></a></h3>
<p>轻量级国际化系统：</p>
<ul>
<li>基于 JSON 语言文件</li>
<li><code v-pre>data-i18n</code> 属性绑定</li>
<li>参数插值支持 (<code v-pre>{key}</code>)</li>
<li>自动保存语言偏好到设置</li>
</ul>
<h2 id="画布体系" tabindex="-1"><a class="header-anchor" href="#画布体系"><span>画布体系</span></a></h2>
<h3 id="图层" tabindex="-1"><a class="header-anchor" href="#图层"><span>图层</span></a></h3>
<table>
<thead>
<tr>
<th>元素</th>
<th>ID</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>img</code></td>
<td><code v-pre>imageElement</code></td>
<td>显示静态图片/PDF 页</td>
</tr>
<tr>
<td><code v-pre>video</code></td>
<td><code v-pre>cameraVideo</code></td>
<td>摄像头实时画面</td>
</tr>
<tr>
<td><code v-pre>canvas</code></td>
<td><code v-pre>drawCanvas</code></td>
<td>批注绘制层</td>
</tr>
</tbody>
</table>
<h3 id="变换系统" tabindex="-1"><a class="header-anchor" href="#变换系统"><span>变换系统</span></a></h3>
<p>使用 CSS <code v-pre>transform: translate3d() scale()</code> 实现：</p>
<ul>
<li><code v-pre>main_update_transform_schedule</code>: RAF 调度变换更新</li>
<li><code v-pre>main_fetch_safe_scale</code>: 安全缩放值获取</li>
<li>移动边界计算 (<code v-pre>moveBound</code>)</li>
</ul>
<h2 id="性能优化策略" tabindex="-1"><a class="header-anchor" href="#性能优化策略"><span>性能优化策略</span></a></h2>
<ol>
<li><strong>批量处理</strong>: RAF 批量绘制减少重绘次数</li>
<li><strong>内存优化</strong>: 使用 Blob URL 替代 Data URL 存储图片</li>
<li><strong>离屏 Canvas 池</strong>: 复用离屏 Canvas，减少内存分配</li>
<li><strong>四叉树索引</strong>: 空间索引加速笔画查询</li>
<li><strong>自适应帧率</strong>: 根据负载动态调整帧率</li>
<li><strong>PDF 懒加载</strong>: 按需加载 PDF 页面</li>
</ol>
</div></template>


