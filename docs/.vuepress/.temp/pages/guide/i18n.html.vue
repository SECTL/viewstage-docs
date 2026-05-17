<template><div><h1 id="国际化" tabindex="-1"><a class="header-anchor" href="#国际化"><span>国际化</span></a></h1>
<h2 id="支持的语言" tabindex="-1"><a class="header-anchor" href="#支持的语言"><span>支持的语言</span></a></h2>
<table>
<thead>
<tr>
<th>语言</th>
<th>代码</th>
<th>文件</th>
</tr>
</thead>
<tbody>
<tr>
<td>简体中文</td>
<td><code v-pre>zh-CN</code></td>
<td><code v-pre>locales/zh-CN.json</code></td>
</tr>
<tr>
<td>繁體中文</td>
<td><code v-pre>zh-TW</code></td>
<td><code v-pre>locales/zh-TW.json</code></td>
</tr>
<tr>
<td>English</td>
<td><code v-pre>en-US</code></td>
<td><code v-pre>locales/en-US.json</code></td>
</tr>
</tbody>
</table>
<h2 id="切换语言" tabindex="-1"><a class="header-anchor" href="#切换语言"><span>切换语言</span></a></h2>
<ol>
<li>点击设置按钮打开设置面板</li>
<li>在&quot;应用设置&quot;页面选择语言</li>
<li>重启应用生效</li>
</ol>
<h2 id="语言文件结构" tabindex="-1"><a class="header-anchor" href="#语言文件结构"><span>语言文件结构</span></a></h2>
<p>语言文件位于 <code v-pre>src/locales/</code> 目录，按功能模块组织：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"common"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 通用词汇 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"loading"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 加载提示 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"sidebar"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 侧边栏 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"toolbar"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 工具栏 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"docScan"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 文档扫描 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"settings"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 设置面板 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"camera"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 摄像头 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"errors"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 错误提示 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"oobe"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 首次引导 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"about"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 关于页面 */</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"rotation"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">/* 旋转 */</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="国际化系统实现" tabindex="-1"><a class="header-anchor" href="#国际化系统实现"><span>国际化系统实现</span></a></h2>
<p><code v-pre>src/i18n.js</code> 实现了轻量级国际化引擎：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// 初始化</span></span>
<span class="line"><span class="token keyword">await</span> i18n<span class="token punctuation">.</span><span class="token function">init_start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 翻译（支持参数插值）</span></span>
<span class="line">i18n<span class="token punctuation">.</span><span class="token function">format_translate</span><span class="token punctuation">(</span><span class="token string">'loading.processingPage'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">current</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">total</span><span class="token operator">:</span> <span class="token number">10</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 切换语言</span></span>
<span class="line"><span class="token keyword">await</span> i18n<span class="token punctuation">.</span><span class="token function">update_locale</span><span class="token punctuation">(</span><span class="token string">'en-US'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 自动渲染页面文本</span></span>
<span class="line">i18n<span class="token punctuation">.</span><span class="token function">render_page_texts</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="属性绑定" tabindex="-1"><a class="header-anchor" href="#属性绑定"><span>属性绑定</span></a></h3>
<table>
<thead>
<tr>
<th>属性</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>data-i18n</code></td>
<td>设置文本内容</td>
</tr>
<tr>
<td><code v-pre>data-i18n-title</code></td>
<td>设置 title 属性</td>
</tr>
<tr>
<td><code v-pre>data-i18n-placeholder</code></td>
<td>设置 placeholder 属性</td>
</tr>
<tr>
<td><code v-pre>data-i18n-aria-label</code></td>
<td>设置 aria-label 属性</td>
</tr>
</tbody>
</table>
<h3 id="语言持久化" tabindex="-1"><a class="header-anchor" href="#语言持久化"><span>语言持久化</span></a></h3>
<p>语言设置保存在：</p>
<ol>
<li>Tauri 配置文件（<code v-pre>settings.language</code>）</li>
<li>localStorage（<code v-pre>language</code> 键）</li>
</ol>
</div></template>


