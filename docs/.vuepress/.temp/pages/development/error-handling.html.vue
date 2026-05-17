<template><div><h1 id="错误处理" tabindex="-1"><a class="header-anchor" href="#错误处理"><span>错误处理</span></a></h1>
<p>ViewStage 采用多层错误处理架构：Rust 后端使用 <code v-pre>Result&lt;T, String&gt;</code> 统一返回，前端通过 try/catch 捕获并展示自定义弹窗。</p>
<h2 id="总体架构" tabindex="-1"><a class="header-anchor" href="#总体架构"><span>总体架构</span></a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">Rust 命令 → Result&lt;T, String></span>
<span class="line">               │</span>
<span class="line">               ▼</span>
<span class="line">JS invoke() → try/catch</span>
<span class="line">               │</span>
<span class="line">               ├─ main_show_error_dialog()  — 主窗口弹窗（含重试）</span>
<span class="line">               ├─ settings_show_dialog()    — 设置窗口弹窗</span>
<span class="line">               ├─ console.error()           — 静默处理</span>
<span class="line">               └─ 前端降级方案              — Rust 失败时使用</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rust-端错误处理" tabindex="-1"><a class="header-anchor" href="#rust-端错误处理"><span>Rust 端错误处理</span></a></h2>
<p>所有 Tauri 命令统一返回 <code v-pre>Result&lt;T, String&gt;</code>，String 作为错误类型自动转为 JS 异常。</p>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs" data-title="rs"><pre v-pre><code><span class="line"><span class="token attribute attr-name">#[tauri::command]</span></span>
<span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">some_command</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">-></span> <span class="token class-name">Result</span><span class="token operator">&lt;</span><span class="token class-name">SomeType</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token operator">></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 使用 map_err 将错误转为中文友好消息</span></span>
<span class="line">    <span class="token keyword">let</span> config <span class="token operator">=</span> <span class="token namespace">std<span class="token punctuation">::</span>fs<span class="token punctuation">::</span></span><span class="token function">read_to_string</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>path<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">map_err</span><span class="token punctuation">(</span><span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>e<span class="token closure-punctuation punctuation">|</span></span> <span class="token macro property">format!</span><span class="token punctuation">(</span><span class="token string">"读取配置文件失败: {}"</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">let</span> parsed<span class="token punctuation">:</span> <span class="token class-name">Value</span> <span class="token operator">=</span> <span class="token namespace">serde_json<span class="token punctuation">::</span></span><span class="token function">from_str</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>config<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">map_err</span><span class="token punctuation">(</span><span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>e<span class="token closure-punctuation punctuation">|</span></span> <span class="token macro property">format!</span><span class="token punctuation">(</span><span class="token string">"解析配置文件失败: {}"</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Ok</span><span class="token punctuation">(</span>parsed<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="错误处理模式" tabindex="-1"><a class="header-anchor" href="#错误处理模式"><span>错误处理模式</span></a></h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>说明</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>map_err</code></td>
<td>转换错误类型</td>
<td><code v-pre>.map_err(|e| format!(&quot;操作失败: {}&quot;, e))?</code></td>
</tr>
<tr>
<td>友好中文消息</td>
<td>错误信息本地化</td>
<td><code v-pre>&quot;创建目录失败&quot;</code>、<code v-pre>&quot;模型文件不存在&quot;</code></td>
</tr>
<tr>
<td>静默忽略</td>
<td>非关键操作</td>
<td><code v-pre>let _ = splashscreen.close();</code></td>
</tr>
</tbody>
</table>
<h2 id="前端自定义弹窗系统" tabindex="-1"><a class="header-anchor" href="#前端自定义弹窗系统"><span>前端自定义弹窗系统</span></a></h2>
<p>项目实现了两套完全自定义的弹窗，未使用 Tauri 原生的 <code v-pre>dialog.message()</code> API。</p>
<h3 id="主窗口弹窗-—-main-show-error-dialog" tabindex="-1"><a class="header-anchor" href="#主窗口弹窗-—-main-show-error-dialog"><span>主窗口弹窗 — <code v-pre>main_show_error_dialog</code></span></a></h3>
<p><strong>文件</strong>: <code v-pre>main.js:4732</code></p>
<p>支持重试回调的错误弹窗，用于关键操作失败（如文件导入、PDF 转换）。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">main_show_error_dialog</span><span class="token punctuation">(</span><span class="token parameter">title<span class="token punctuation">,</span> message<span class="token punctuation">,</span> retryCallback <span class="token operator">=</span> <span class="token keyword">null</span></span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>调用场景</strong> (共 18 处):</p>
<table>
<thead>
<tr>
<th>场景</th>
<th>重试支持</th>
</tr>
</thead>
<tbody>
<tr>
<td>文件路径解析失败</td>
<td>否</td>
</tr>
<tr>
<td>Office 检测失败（未安装）</td>
<td>否</td>
</tr>
<tr>
<td>Office 检测异常</td>
<td>否</td>
</tr>
<tr>
<td>文件读取失败</td>
<td>否</td>
</tr>
<tr>
<td>Word 文档转换失败</td>
<td>是</td>
</tr>
<tr>
<td>PDF.js 库加载超时</td>
<td>否</td>
</tr>
<tr>
<td>文件导入失败</td>
<td>否</td>
</tr>
<tr>
<td>摄像头未就绪</td>
<td>否</td>
</tr>
</tbody>
</table>
<p><strong>HTML 结构</strong>:</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-dialog-overlay<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>errorDialog<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-dialog<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-icon<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>⚠️<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-title<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>错误标题<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-message<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>错误详情（pre-wrap 保留换行）<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-buttons<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-btn error-btn-retry<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>重试<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>error-btn error-btn-close<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>关闭<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置窗口弹窗-—-settings-show-dialog" tabindex="-1"><a class="header-anchor" href="#设置窗口弹窗-—-settings-show-dialog"><span>设置窗口弹窗 — <code v-pre>settings_show_dialog</code></span></a></h3>
<p><strong>文件</strong>: <code v-pre>settings.js:15</code></p>
<p>三种类型的信息弹窗。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">settings_show_dialog</span><span class="token punctuation">(</span>title<span class="token punctuation">,</span> message<span class="token punctuation">,</span> type <span class="token operator">=</span> <span class="token string">'info'</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// type: 'info' | 'error' | 'success'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>用于设置保存结果、模型下载结果、配置文件导入/导出状态反馈（约 30+ 处调用）。</p>
<h3 id="系统对话框使用" tabindex="-1"><a class="header-anchor" href="#系统对话框使用"><span>系统对话框使用</span></a></h3>
<table>
<thead>
<tr>
<th>对话框类型</th>
<th>用途</th>
<th>调用处</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>confirm()</code></td>
<td>模型删除确认</td>
<td><code v-pre>settings.js:1790</code>（DBNet）、<code v-pre>:1882</code>（UVDoc）、<code v-pre>:1973</code>（DexiNed）</td>
</tr>
<tr>
<td><code v-pre>dialog.open()</code></td>
<td>文件选择器（导入配置/模型）</td>
<td><code v-pre>settings.js</code>、<code v-pre>oobe.js</code></td>
</tr>
<tr>
<td><code v-pre>dialog.save()</code></td>
<td>文件保存器（导出配置）</td>
<td><code v-pre>settings.js</code></td>
</tr>
<tr>
<td><code v-pre>alert()</code></td>
<td>简单提示（非 Tauri 环境回退）</td>
<td><code v-pre>doc-scan.js</code>、<code v-pre>doc-scan-page.js</code>、<code v-pre>main.js</code></td>
</tr>
</tbody>
</table>
<h3 id="模态确认框" tabindex="-1"><a class="header-anchor" href="#模态确认框"><span>模态确认框</span></a></h3>
<p><strong>文件</strong>: <code v-pre>settings.html</code></p>
<p>用于需要用户确认的破坏性操作。</p>
<table>
<thead>
<tr>
<th>用途</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>重置应用</td>
<td>清除所有设置和缓存</td>
</tr>
<tr>
<td>撤销摄像头权限</td>
<td>重置摄像头权限状态</td>
</tr>
<tr>
<td>重启应用提示</td>
<td>设置变更后建议重启</td>
</tr>
</tbody>
</table>
<h2 id="加载遮罩-—-main-show-loading-overlay" tabindex="-1"><a class="header-anchor" href="#加载遮罩-—-main-show-loading-overlay"><span>加载遮罩 — <code v-pre>main_show_loading_overlay</code></span></a></h2>
<p><strong>文件</strong>: <code v-pre>main.js:4705</code></p>
<p>长时间操作（如 PDF 导入）的加载状态反馈。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">main_show_loading_overlay</span><span class="token punctuation">(</span><span class="token parameter">message</span><span class="token punctuation">)</span>  <span class="token comment">// 显示加载遮罩</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">main_update_loading_progress</span><span class="token punctuation">(</span><span class="token parameter">message</span><span class="token punctuation">)</span> <span class="token comment">// 更新进度文字</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">main_hide_loading_overlay</span><span class="token punctuation">(</span><span class="token punctuation">)</span>          <span class="token comment">// 隐藏加载遮罩</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="错误分类处理" tabindex="-1"><a class="header-anchor" href="#错误分类处理"><span>错误分类处理</span></a></h2>
<h3 id="摄像头错误" tabindex="-1"><a class="header-anchor" href="#摄像头错误"><span>摄像头错误</span></a></h3>
<p>按错误类型分类处理（<code v-pre>init.js:300</code>、<code v-pre>main.js:3680</code>）：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">.</span>name <span class="token operator">===</span> <span class="token string">'NotFoundError'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 未检测到摄像头 → 进入无摄像头模式</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">.</span>name <span class="token operator">===</span> <span class="token string">'NotAllowedError'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 无摄像头权限 → 提示用户授权</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 通用初始化失败</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="word-转换错误" tabindex="-1"><a class="header-anchor" href="#word-转换错误"><span>Word 转换错误</span></a></h3>
<p>按错误内容分析原因（<code v-pre>main.js:1158</code>）：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> errorMsg <span class="token operator">=</span> <span class="token function">String</span><span class="token punctuation">(</span>convertError<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>errorMsg<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span><span class="token string">'Office'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    friendlyMsg <span class="token operator">=</span> <span class="token string">'Office 软件调用失败\n可能的原因：\n...'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token function">main_show_error_dialog</span><span class="token punctuation">(</span><span class="token string">'转换失败'</span><span class="token punctuation">,</span> friendlyMsg<span class="token punctuation">,</span> retryCallback<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="前端降级方案" tabindex="-1"><a class="header-anchor" href="#前端降级方案"><span>前端降级方案</span></a></h2>
<p>当 Rust 后端命令失败时，前端自动尝试使用纯 JS 方案降级。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">        result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token string">'stroke_format_compact'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> request <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">'Rust 笔画压缩失败，使用前端降级方案:'</span><span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">// 前端降级处理（纯 Canvas 实现）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="权限配置" tabindex="-1"><a class="header-anchor" href="#权限配置"><span>权限配置</span></a></h2>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"permissions"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"dialog:default"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"dialog:allow-open"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"dialog:allow-save"</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：未注册 <code v-pre>dialog:allow-message</code> 或 <code v-pre>dialog:allow-ask</code>，因为项目使用自定义 HTML/CSS 弹窗替代原生对话框。</p>
</div></template>


