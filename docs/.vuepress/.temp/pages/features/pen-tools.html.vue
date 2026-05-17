<template><div><h1 id="画笔工具" tabindex="-1"><a class="header-anchor" href="#画笔工具"><span>画笔工具</span></a></h1>
<h2 id="功能概述" tabindex="-1"><a class="header-anchor" href="#功能概述"><span>功能概述</span></a></h2>
<p>ViewStage 提供功能完整的画笔工具，支持多色画笔、无级调节线宽、橡皮擦以及高级的钢笔笔锋效果。</p>
<h2 id="画笔配置" tabindex="-1"><a class="header-anchor" href="#画笔配置"><span>画笔配置</span></a></h2>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> <span class="token constant">DRAW_CONFIG</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">penColor</span><span class="token operator">:</span> <span class="token string">'#3498db'</span><span class="token punctuation">,</span>    <span class="token comment">// 默认笔色</span></span>
<span class="line">    <span class="token literal-property property">penWidth</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>            <span class="token comment">// 默认笔宽 (px)</span></span>
<span class="line">    <span class="token literal-property property">eraserSize</span><span class="token operator">:</span> <span class="token number">15</span><span class="token punctuation">,</span>         <span class="token comment">// 橡皮大小 (px)</span></span>
<span class="line">    <span class="token literal-property property">penEffectMode</span><span class="token operator">:</span> <span class="token string">'limited'</span><span class="token punctuation">,</span> <span class="token comment">// 钢笔效果模式</span></span>
<span class="line">    <span class="token comment">// ...</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="颜色系统" tabindex="-1"><a class="header-anchor" href="#颜色系统"><span>颜色系统</span></a></h2>
<ul>
<li>预设 15 种颜色（红、橙、黄、绿、青、蓝、紫、粉等）</li>
<li>支持自定义增删画笔颜色</li>
<li>颜色取色器支持 HSV 选择和十六进制输入</li>
</ul>
<h2 id="画笔调节" tabindex="-1"><a class="header-anchor" href="#画笔调节"><span>画笔调节</span></a></h2>
<h3 id="画笔宽度" tabindex="-1"><a class="header-anchor" href="#画笔宽度"><span>画笔宽度</span></a></h3>
<ul>
<li>范围：1-20px</li>
<li>滑块调节 + 数值显示</li>
</ul>
<h3 id="橡皮擦大小" tabindex="-1"><a class="header-anchor" href="#橡皮擦大小"><span>橡皮擦大小</span></a></h3>
<ul>
<li>范围：1-50px</li>
<li>滑块调节 + 数值显示</li>
</ul>
<h2 id="钢笔笔锋效果" tabindex="-1"><a class="header-anchor" href="#钢笔笔锋效果"><span>钢笔笔锋效果</span></a></h2>
<p>实现位置：<code v-pre>src/main.js</code>（<code v-pre>RealPenManager</code> 类）和 <code v-pre>src/batch-draw.js</code></p>
<h3 id="效果模式" tabindex="-1"><a class="header-anchor" href="#效果模式"><span>效果模式</span></a></h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>off</code></td>
<td>关闭笔锋，均匀线宽</td>
</tr>
<tr>
<td><code v-pre>limited</code></td>
<td>有限效果，适用于一般教学</td>
</tr>
<tr>
<td><code v-pre>full</code></td>
<td>完整效果，适用于精细绘图</td>
</tr>
</tbody>
</table>
<h3 id="核心算法" tabindex="-1"><a class="header-anchor" href="#核心算法"><span>核心算法</span></a></h3>
<ol>
<li><strong>速度计算</strong>: 根据指针移动速度动态调整线宽</li>
<li><strong>Catmull-Rom 样条插值</strong>: 平滑笔迹路径</li>
<li><strong>起笔渐变</strong>: 笔画起始 4 段渐入效果</li>
<li><strong>收笔渐变</strong>: 笔画结束 6 段渐出效果</li>
<li><strong>曲面细分</strong>: 使用 <code v-pre>pen_tessellator.js</code> 构建细分网格</li>
</ol>
<h3 id="线宽计算" tabindex="-1"><a class="header-anchor" href="#线宽计算"><span>线宽计算</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token function">calc_line_width</span><span class="token punctuation">(</span><span class="token parameter">baseWidth<span class="token punctuation">,</span> velocity<span class="token punctuation">,</span> pressure <span class="token operator">=</span> <span class="token number">0.5</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> speedFactor <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">-</span> eased <span class="token operator">*</span> <span class="token number">0.75</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">const</span> pressureFactor <span class="token operator">=</span> <span class="token number">0.85</span> <span class="token operator">+</span> <span class="token punctuation">(</span>pressure <span class="token operator">*</span> <span class="token number">0.3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> baseWidth <span class="token operator">*</span> speedFactor <span class="token operator">*</span> pressureFactor<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


