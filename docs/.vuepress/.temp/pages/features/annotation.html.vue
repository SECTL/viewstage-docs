<template><div><h1 id="批注系统" tabindex="-1"><a class="header-anchor" href="#批注系统"><span>批注系统</span></a></h1>
<h2 id="功能概述" tabindex="-1"><a class="header-anchor" href="#功能概述"><span>功能概述</span></a></h2>
<p>批注系统是 ViewStage 的核心功能之一，支持在摄像头画面、图片或 PDF 页面上进行自由绘制批注。</p>
<h2 id="架构设计" tabindex="-1"><a class="header-anchor" href="#架构设计"><span>架构设计</span></a></h2>
<h3 id="图层结构" tabindex="-1"><a class="header-anchor" href="#图层结构"><span>图层结构</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">canvasContainer</span>
<span class="line">  └── canvasWrapper (CSS transform: translate3d + scale)</span>
<span class="line">      ├── imageElement (图像层 - img)</span>
<span class="line">      ├── cameraVideo (摄像头层 - video)</span>
<span class="line">      └── drawCanvas (批注层 - canvas)</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="批注层-drawcanvas" tabindex="-1"><a class="header-anchor" href="#批注层-drawcanvas"><span>批注层 (drawCanvas)</span></a></h3>
<ul>
<li>Canvas 2D 上下文，<code v-pre>alpha: true</code>，<code v-pre>desynchronized: true</code>（低延迟渲染）</li>
<li>尺寸：逻辑尺寸为屏幕尺寸的 2 倍</li>
<li>DPR 缩放：支持设备像素比</li>
</ul>
<h2 id="撤销-重做系统" tabindex="-1"><a class="header-anchor" href="#撤销-重做系统"><span>撤销/重做系统</span></a></h2>
<p>实现位置：<code v-pre>src/history.js</code></p>
<p>采用<strong>命令模式</strong>设计：</p>
<h3 id="命令类型" tabindex="-1"><a class="header-anchor" href="#命令类型"><span>命令类型</span></a></h3>
<table>
<thead>
<tr>
<th>命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>DrawCommand</code></td>
<td>绘制笔画</td>
</tr>
<tr>
<td><code v-pre>EraseCommand</code></td>
<td>橡皮擦除</td>
</tr>
<tr>
<td><code v-pre>PenEraseCommand</code></td>
<td>钢笔效果笔画切割</td>
</tr>
<tr>
<td><code v-pre>ClearCommand</code></td>
<td>清空所有笔画</td>
</tr>
<tr>
<td><code v-pre>SnapshotCommand</code></td>
<td>快照压缩（合并历史）</td>
</tr>
</tbody>
</table>
<h3 id="历史管理器" tabindex="-1"><a class="header-anchor" href="#历史管理器"><span>历史管理器</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">history_state <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">undo_list</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>    <span class="token comment">// 撤销栈</span></span>
<span class="line">    <span class="token literal-property property">redo_list</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>    <span class="token comment">// 重做栈</span></span>
<span class="line">    <span class="token literal-property property">is_executing</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">on_state_change</span><span class="token operator">:</span> <span class="token keyword">null</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>最大历史步数：<code v-pre>MAX_HISTORY_STEPS = 50</code></li>
<li>软上限触发快照压缩，硬上限 100 步强制裁剪</li>
</ul>
<h2 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化"><span>性能优化</span></a></h2>
<h3 id="批量绘制-batch-draw-js" tabindex="-1"><a class="header-anchor" href="#批量绘制-batch-draw-js"><span>批量绘制 (batch-draw.js)</span></a></h3>
<p>使用 <code v-pre>requestAnimationFrame</code> 批量提交绘制命令，减少重绘次数：</p>
<ul>
<li>自适应帧率（根据绘制负载动态调整 20-60 FPS）</li>
<li>命令缓冲合并</li>
<li>上下文状态缓存</li>
</ul>
<h3 id="四叉树空间索引-main-js" tabindex="-1"><a class="header-anchor" href="#四叉树空间索引-main-js"><span>四叉树空间索引 (main.js)</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">StrokeQuadTree</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 用于快速查找与脏区域相交的笔画</span></span>
<span class="line">    <span class="token comment">// 优化局部重绘性能</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="离屏-canvas-池" tabindex="-1"><a class="header-anchor" href="#离屏-canvas-池"><span>离屏 Canvas 池</span></a></h3>
<p>复用离屏 Canvas 对象，减少内存分配：</p>
<ul>
<li>池大小：2</li>
<li>用于笔画压缩和重绘优化</li>
</ul>
</div></template>


