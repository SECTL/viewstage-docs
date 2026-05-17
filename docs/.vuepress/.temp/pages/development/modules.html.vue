<template><div><h1 id="模块详解" tabindex="-1"><a class="header-anchor" href="#模块详解"><span>模块详解</span></a></h1>
<h2 id="钢笔笔锋模块-pen-tessellator-js" tabindex="-1"><a class="header-anchor" href="#钢笔笔锋模块-pen-tessellator-js"><span>钢笔笔锋模块 (<code v-pre>pen_tessellator.js</code>)</span></a></h2>
<p>实现钢笔效果的曲面细分算法，根据速度和压感动态调整线宽，使用 Catmull-Rom 样条插值平滑笔迹。</p>
<p>核心接口：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// 构建笔触细分网格</span></span>
<span class="line"><span class="token function">tessellator_build_stroke_from_stroke_data</span><span class="token punctuation">(</span>stroke<span class="token punctuation">,</span> options<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 渲染细分网格</span></span>
<span class="line"><span class="token function">tessellator_render_stroke</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> tessellated_stroke<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="主题系统-themes" tabindex="-1"><a class="header-anchor" href="#主题系统-themes"><span>主题系统 (<code v-pre>themes/</code>)</span></a></h2>
<h3 id="架构" tabindex="-1"><a class="header-anchor" href="#架构"><span>架构</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">themes/</span>
<span class="line">├── theme.js         # 主题管理器</span>
<span class="line">├── simplify/        # 简化主题（默认）</span>
<span class="line">│   └── theme.js</span>
<span class="line">└── dark/            # 深色主题</span>
<span class="line">    └── theme.js</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="主题管理器" tabindex="-1"><a class="header-anchor" href="#主题管理器"><span>主题管理器</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">ThemeManager<span class="token punctuation">.</span><span class="token function">theme_update_active</span><span class="token punctuation">(</span>themeName<span class="token punctuation">)</span></span>
<span class="line">  → 尝试加载用户自定义主题</span>
<span class="line">  → 回退到内置主题</span>
<span class="line">  → 应用主题（画布背景、颜色等）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>支持用户自定义主题（位于 <code v-pre>%APPDATA%/SECTL/ViewStage/themes/{name}/</code>）。</p>
<h2 id="国际化系统-i18n-js" tabindex="-1"><a class="header-anchor" href="#国际化系统-i18n-js"><span>国际化系统 (<code v-pre>i18n.js</code>)</span></a></h2>
<h3 id="支持语言" tabindex="-1"><a class="header-anchor" href="#支持语言"><span>支持语言</span></a></h3>
<table>
<thead>
<tr>
<th>代码</th>
<th>语言</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>zh-CN</code></td>
<td>简体中文</td>
</tr>
<tr>
<td><code v-pre>zh-TW</code></td>
<td>繁體中文</td>
</tr>
<tr>
<td><code v-pre>en-US</code></td>
<td>English</td>
</tr>
</tbody>
</table>
<h3 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法"><span>使用方法</span></a></h3>
<p>HTML 中通过 <code v-pre>data-i18n</code> 属性绑定：</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">data-i18n</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>toolbar.move<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>移动<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">data-i18n-title</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>rotation.rotateLeft<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>↺<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">data-i18n-placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>common.search<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>JavaScript 中通过 <code v-pre>format_translate</code> 获取：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">i18n<span class="token punctuation">.</span><span class="token function">format_translate</span><span class="token punctuation">(</span><span class="token string">'loading.processingPage'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">current</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">total</span><span class="token operator">:</span> <span class="token number">10</span> <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// → "正在处理 1/10 页"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多窗口系统" tabindex="-1"><a class="header-anchor" href="#多窗口系统"><span>多窗口系统</span></a></h2>
<p>ViewStage 包含多个窗口：</p>
<table>
<thead>
<tr>
<th>窗口</th>
<th>URL</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>main</code></td>
<td><code v-pre>index.html</code></td>
<td>主展台界面</td>
</tr>
<tr>
<td><code v-pre>splashscreen</code></td>
<td><code v-pre>splashscreen.html</code></td>
<td>启动画面</td>
</tr>
<tr>
<td><code v-pre>settings</code></td>
<td><code v-pre>settings.html</code></td>
<td>设置窗口</td>
</tr>
<tr>
<td><code v-pre>doc-scan</code></td>
<td><code v-pre>doc-scan/index.html</code></td>
<td>文档扫描窗口</td>
</tr>
<tr>
<td><code v-pre>oobe</code></td>
<td><code v-pre>oobe.html</code></td>
<td>首次运行引导</td>
</tr>
</tbody>
</table>
<h2 id="单实例管理" tabindex="-1"><a class="header-anchor" href="#单实例管理"><span>单实例管理</span></a></h2>
<p>使用 <code v-pre>tauri-plugin-single-instance</code> 确保只能运行一个实例。当第二个实例启动时：</p>
<ol>
<li>传递文件路径到主实例</li>
<li>发送 <code v-pre>file-opened</code> 事件</li>
<li>激活并聚焦主窗口</li>
</ol>
<h2 id="csp-安全策略" tabindex="-1"><a class="header-anchor" href="#csp-安全策略"><span>CSP 安全策略</span></a></h2>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"security"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"csp"</span><span class="token operator">:</span> <span class="token string">"default-src 'self'; connect-src 'self' ipc.localhost: data: blob:; media-src 'self' blob: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; worker-src 'self' blob:;"</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tauri-conf-json-配置" tabindex="-1"><a class="header-anchor" href="#tauri-conf-json-配置"><span>tauri.conf.json 配置</span></a></h2>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"productName"</span><span class="token operator">:</span> <span class="token string">"ViewStage"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.15.0"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"identifier"</span><span class="token operator">:</span> <span class="token string">"SECTL.ViewStage"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"app"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"withGlobalTauri"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"windows"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"main"</span><span class="token punctuation">,</span> <span class="token property">"fullscreen"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token property">"decorations"</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"splashscreen"</span><span class="token punctuation">,</span> <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"splashscreen.html"</span> <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"bundle"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"fileAssociations"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token property">"ext"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"pdf"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"PDF Document"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token property">"ext"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"docx"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Word Document"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token property">"ext"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"doc"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Word 97-2003 Document"</span> <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


