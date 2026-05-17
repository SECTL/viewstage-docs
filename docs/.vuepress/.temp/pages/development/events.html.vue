<template><div><h1 id="事件系统" tabindex="-1"><a class="header-anchor" href="#事件系统"><span>事件系统</span></a></h1>
<p>ViewStage 使用 Tauri 事件系统实现前后端通信和窗口间通信。所有事件通过 <code v-pre>window.__TAURI__.event</code> API 的 <code v-pre>emit</code> / <code v-pre>listen</code> 机制传递。</p>
<h2 id="事件总览" tabindex="-1"><a class="header-anchor" href="#事件总览"><span>事件总览</span></a></h2>
<table>
<thead>
<tr>
<th>事件名</th>
<th>发送方</th>
<th>接收方</th>
<th>载荷</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>splash-progress</code></td>
<td><code v-pre>init.js</code></td>
<td><code v-pre>splashscreen.html</code></td>
<td><code v-pre>{ step, message }</code></td>
<td>启动画面进度更新</td>
</tr>
<tr>
<td><code v-pre>file-opened</code></td>
<td><code v-pre>lib.rs</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>string</code> (file path)</td>
<td>单实例文件打开</td>
</tr>
<tr>
<td><code v-pre>settings-changed</code></td>
<td><code v-pre>settings.js</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>string</code> (key)</td>
<td>设置变更通知</td>
</tr>
<tr>
<td><code v-pre>theme-changed</code></td>
<td><code v-pre>settings.js</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>string</code> (theme name)</td>
<td>主题切换通知</td>
</tr>
<tr>
<td><code v-pre>mirror-changed</code></td>
<td><code v-pre>lib.rs</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>boolean</code></td>
<td>镜像状态变更</td>
</tr>
<tr>
<td><code v-pre>language-changed</code></td>
<td><code v-pre>settings.js</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>string</code> (locale)</td>
<td>语言切换通知</td>
</tr>
<tr>
<td><code v-pre>download-progress</code></td>
<td><code v-pre>lib.rs</code></td>
<td><code v-pre>settings.js</code></td>
<td><code v-pre>{ downloaded, total }</code></td>
<td>模型下载进度</td>
</tr>
<tr>
<td><code v-pre>menu-event</code></td>
<td><code v-pre>lib.rs</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>string</code> (action)</td>
<td>菜单操作事件</td>
</tr>
<tr>
<td><code v-pre>main-win-focused</code></td>
<td><code v-pre>lib.rs</code></td>
<td><code v-pre>main.js</code></td>
<td><code v-pre>null</code></td>
<td>主窗口聚焦通知</td>
</tr>
</tbody>
</table>
<h2 id="事件详情" tabindex="-1"><a class="header-anchor" href="#事件详情"><span>事件详情</span></a></h2>
<h3 id="splash-progress" tabindex="-1"><a class="header-anchor" href="#splash-progress"><span><code v-pre>splash-progress</code></span></a></h3>
<p>启动画面进度事件，由 <code v-pre>init.js</code> 在初始化各阶段发送。</p>
<p><strong>发送方</strong>: <code v-pre>init.js</code> — <code v-pre>app_emit_splash_progress(step, message)</code></p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">app_emit_splash_progress</span><span class="token punctuation">(</span><span class="token parameter">step<span class="token punctuation">,</span> message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">'splash-progress'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> step<span class="token punctuation">,</span> message <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤定义</strong>:</p>
<table>
<thead>
<tr>
<th>step</th>
<th>进度</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>10%</td>
<td>初始化国际化、DOM、画布</td>
</tr>
<tr>
<td>1</td>
<td>30%</td>
<td>加载设置和缓存</td>
</tr>
<tr>
<td>2</td>
<td>50%</td>
<td>加载主题</td>
</tr>
<tr>
<td>3</td>
<td>70%</td>
<td>初始化摄像头</td>
</tr>
<tr>
<td>4</td>
<td>90%</td>
<td>收尾处理</td>
</tr>
<tr>
<td>5</td>
<td>100%</td>
<td>完成，隐藏启动画面</td>
</tr>
</tbody>
</table>
<p><strong>特殊值</strong>: <code v-pre>step === -1</code> 用于显示诊断信息。</p>
<h3 id="file-opened" tabindex="-1"><a class="header-anchor" href="#file-opened"><span><code v-pre>file-opened</code></span></a></h3>
<p>单实例文件打开事件。当用户双击关联文件启动第二个应用实例时，文件路径通过此事件传递给主实例。</p>
<p><strong>发送方</strong>: <code v-pre>lib.rs</code> — <code v-pre>tauri-plugin-single-instance</code> 回调</p>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs" data-title="rs"><pre v-pre><code><span class="line"><span class="token comment">// lib.rs</span></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">on_event</span><span class="token punctuation">(</span><span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>app<span class="token punctuation">,</span> event<span class="token closure-punctuation punctuation">|</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token keyword">let</span> <span class="token namespace">tauri<span class="token punctuation">::</span></span><span class="token class-name">RunEvent</span><span class="token punctuation">::</span><span class="token class-name">Opened</span> <span class="token punctuation">{</span> urls <span class="token punctuation">}</span> <span class="token operator">=</span> event <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 处理文件打开请求</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>接收方</strong>: <code v-pre>main.js</code></p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">'file-opened'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> filePath <span class="token operator">=</span> event<span class="token punctuation">.</span>payload<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 解析文件路径并加载</span></span>
<span class="line">    <span class="token function">file_load_file</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="settings-changed" tabindex="-1"><a class="header-anchor" href="#settings-changed"><span><code v-pre>settings-changed</code></span></a></h3>
<p>设置变更通知事件。当设置在 <code v-pre>settings</code> 窗口中被修改并保存后，通知主窗口刷新对应设置。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// settings.js — 发送</span></span>
<span class="line"><span class="token keyword">await</span> window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">'settings-changed'</span><span class="token punctuation">,</span> settingKey<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// main.js — 接收</span></span>
<span class="line">window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">'settings-changed'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> key <span class="token operator">=</span> event<span class="token punctuation">.</span>payload<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 根据 key 刷新对应设置</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="theme-changed" tabindex="-1"><a class="header-anchor" href="#theme-changed"><span><code v-pre>theme-changed</code></span></a></h3>
<p>主题切换通知事件。当用户在设置窗口切换主题后，通知主窗口立即应用新主题。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// settings.js — 发送</span></span>
<span class="line"><span class="token keyword">await</span> window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">'theme-changed'</span><span class="token punctuation">,</span> themeName<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// main.js — 接收  </span></span>
<span class="line">window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">'theme-changed'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> themeName <span class="token operator">=</span> event<span class="token punctuation">.</span>payload<span class="token punctuation">;</span></span>
<span class="line">    ThemeManager<span class="token punctuation">.</span><span class="token function">theme_update_active</span><span class="token punctuation">(</span>themeName<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mirror-changed" tabindex="-1"><a class="header-anchor" href="#mirror-changed"><span><code v-pre>mirror-changed</code></span></a></h3>
<p>镜像状态变更事件。由 Rust 端在 <code v-pre>mirror_update_state</code> 命令中发送。</p>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs" data-title="rs"><pre v-pre><code><span class="line"><span class="token comment">// lib.rs</span></span>
<span class="line"><span class="token attribute attr-name">#[tauri::command]</span></span>
<span class="line"><span class="token keyword">async</span> <span class="token keyword">fn</span> <span class="token function-definition function">mirror_update_state</span><span class="token punctuation">(</span>enabled<span class="token punctuation">:</span> <span class="token keyword">bool</span><span class="token punctuation">,</span> app<span class="token punctuation">:</span> <span class="token namespace">tauri<span class="token punctuation">::</span></span><span class="token class-name">AppHandle</span><span class="token punctuation">)</span> <span class="token punctuation">-></span> <span class="token class-name">Result</span><span class="token operator">&lt;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token operator">></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token constant">MIRROR_STATE</span><span class="token punctuation">.</span><span class="token function">store</span><span class="token punctuation">(</span>enabled<span class="token punctuation">,</span> <span class="token class-name">Ordering</span><span class="token punctuation">::</span><span class="token class-name">SeqCst</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    app<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"mirror-changed"</span><span class="token punctuation">,</span> enabled<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">map_err</span><span class="token punctuation">(</span><span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>e<span class="token closure-punctuation punctuation">|</span></span> <span class="token macro property">format!</span><span class="token punctuation">(</span><span class="token string">"发送镜像状态事件失败: {}"</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Ok</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="download-progress" tabindex="-1"><a class="header-anchor" href="#download-progress"><span><code v-pre>download-progress</code></span></a></h3>
<p>AI 模型下载进度事件。下载 DBNet / UVDoc 模型时定期发送。</p>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs" data-title="rs"><pre v-pre><code><span class="line"><span class="token comment">// lib.rs — 下载循环中</span></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"download-progress"</span><span class="token punctuation">,</span> <span class="token namespace">serde_json<span class="token punctuation">::</span></span><span class="token macro property">json!</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">"downloaded"</span><span class="token punctuation">:</span> downloaded<span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">"total"</span><span class="token punctuation">:</span> total_size</span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ok</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="menu-event" tabindex="-1"><a class="header-anchor" href="#menu-event"><span><code v-pre>menu-event</code></span></a></h3>
<p>系统菜单操作事件。当用户通过菜单触发操作时发送。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// main.js — 接收</span></span>
<span class="line">window<span class="token punctuation">.</span>__TAURI__<span class="token punctuation">.</span>event<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">'menu-event'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> action <span class="token operator">=</span> event<span class="token punctuation">.</span>payload<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">switch</span> <span class="token punctuation">(</span>action<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token string">'toggle-fullscreen'</span><span class="token operator">:</span> <span class="token comment">/* ... */</span> <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token string">'show-settings'</span><span class="token operator">:</span>     <span class="token comment">/* ... */</span> <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// ...</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="main-win-focused" tabindex="-1"><a class="header-anchor" href="#main-win-focused"><span><code v-pre>main-win-focused</code></span></a></h3>
<p>主窗口聚焦事件。当主窗口获得焦点时发送，用于重新初始化摄像头等操作。</p>
<h2 id="窗口间通信模式" tabindex="-1"><a class="header-anchor" href="#窗口间通信模式"><span>窗口间通信模式</span></a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line"> splashscreen 窗口         main 窗口         settings 窗口</span>
<span class="line">     │                       │                    │</span>
<span class="line">     │  ◄── splash-progress ─┤                    │</span>
<span class="line">     │                       │                    │</span>
<span class="line">     │                       │  ◄── file-opened ──┤ (单实例)</span>
<span class="line">     │                       │                    │</span>
<span class="line">     │                       │  ◄── settings-changed ─┤</span>
<span class="line">     │                       │  ◄── theme-changed ────┤</span>
<span class="line">     │                       │  ◄── language-changed ─┤</span>
<span class="line">     │                       │                    │</span>
<span class="line">     │                       │  ◄── mirror-changed ─┤</span>
<span class="line">     │                       │  ◄── download-progress ┤</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rust-端事件-api" tabindex="-1"><a class="header-anchor" href="#rust-端事件-api"><span>Rust 端事件 API</span></a></h2>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs" data-title="rs"><pre v-pre><code><span class="line"><span class="token comment">// 发送事件（向特定窗口）</span></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">get_webview_window</span><span class="token punctuation">(</span><span class="token string">"main"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span><span class="token function">unwrap</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"event-name"</span><span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 发送事件（全局广播）</span></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"event-name"</span><span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 监听事件</span></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">"event-name"</span><span class="token punctuation">,</span> <span class="token closure-params"><span class="token closure-punctuation punctuation">|</span>event<span class="token closure-punctuation punctuation">|</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">let</span> payload <span class="token operator">=</span> event<span class="token punctuation">.</span><span class="token function">payload</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 处理事件</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="前端事件-api" tabindex="-1"><a class="header-anchor" href="#前端事件-api"><span>前端事件 API</span></a></h2>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// 发送事件</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> emit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@tauri-apps/api/event'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">await</span> <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">'event-name'</span><span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 监听事件</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> listen <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@tauri-apps/api/event'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">const</span> unlisten <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">'event-name'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> payload <span class="token operator">=</span> event<span class="token punctuation">.</span>payload<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 处理事件</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 取消监听</span></span>
<span class="line"><span class="token function">unlisten</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


