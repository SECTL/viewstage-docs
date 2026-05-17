<template><div><h1 id="启动画面" tabindex="-1"><a class="header-anchor" href="#启动画面"><span>启动画面</span></a></h1>
<p>ViewStage 在应用启动时显示闪屏窗口，展示应用 Logo 和加载进度。启动画面由 <code v-pre>splashscreen</code> 窗口承载，通过 Tauri 事件系统接收主窗口的初始化进度。</p>
<h2 id="窗口配置" tabindex="-1"><a class="header-anchor" href="#窗口配置"><span>窗口配置</span></a></h2>
<p><code v-pre>splashscreen</code> 窗口在 <code v-pre>tauri.conf.json</code> 中预定义：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"splashscreen"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"splashscreen.html"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"width"</span><span class="token operator">:</span> <span class="token number">400</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"height"</span><span class="token operator">:</span> <span class="token number">250</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"decorations"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"center"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"alwaysOnTop"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"visible"</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>main</code> 窗口初始为隐藏状态（<code v-pre>&quot;visible&quot;: false</code>），待加载完成后由启动画面控制显示。</p>
<h2 id="加载流程" tabindex="-1"><a class="header-anchor" href="#加载流程"><span>加载流程</span></a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">应用启动</span>
<span class="line">  │</span>
<span class="line">  ▼</span>
<span class="line">splashscreen 窗口自动打开 (splashscreen.html)</span>
<span class="line">  │</span>
<span class="line">  ├─ 显示 Logo（fadeIn 动画 0.4s）</span>
<span class="line">  ├─ 显示标题 "ViewStage"（fadeIn 动画 0.4s，延时 0.1s）</span>
<span class="line">  ├─ 显示进度条和加载文字（fadeIn 动画 0.4s，延时 0.2s）</span>
<span class="line">  ├─ 设置初始进度 step=0 (10% — "正在初始化...")</span>
<span class="line">  ├─ splash_load_theme() — 获取设置并应用主题</span>
<span class="line">  └─ 注册 splash-progress 事件监听</span>
<span class="line">  │</span>
<span class="line">  ▼</span>
<span class="line">index.html 加载 (main 窗口，不可见)</span>
<span class="line">  │</span>
<span class="line">  ├─ main_signal_loaded() — 标记脚本加载完成</span>
<span class="line">  └─ import 各模块 (theme.js, pen_tessellator.js, main.js, init.js)</span>
<span class="line">  │</span>
<span class="line">  ▼</span>
<span class="line">init.js → main_init_all()</span>
<span class="line">  │</span>
<span class="line">  ├─ step 0 (10%) — 初始化: i18n, DOM, Canvas, 事件</span>
<span class="line">  ├─ step 1 (30%) — 加载设置和缓存</span>
<span class="line">  ├─ step 2 (50%) — 加载主题</span>
<span class="line">  ├─ step 3 (70%) — 初始化摄像头</span>
<span class="line">  ├─ step 4 (90%) — 收尾处理</span>
<span class="line">  ├─ step 5 (100%) — 完成</span>
<span class="line">  │</span>
<span class="line">  ▼</span>
<span class="line">window_hide_splashscreen() — Rust 命令</span>
<span class="line">  │</span>
<span class="line">  ├─ splashscreen.close() — 关闭闪屏窗口</span>
<span class="line">  ├─ main_window.show()   — 显示主窗口</span>
<span class="line">  └─ main_window.set_focus() — 主窗口获得焦点</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="诊断机制" tabindex="-1"><a class="header-anchor" href="#诊断机制"><span>诊断机制</span></a></h2>
<p>启动画面内置 5 秒诊断定时器：</p>
<ul>
<li><code v-pre>main_check_loaded()</code> 检查主窗口脚本是否已加载</li>
<li>若未加载，显示红色诊断文字：<code v-pre>&quot;诊断：主窗口脚本未加载，检查控制台错误&quot;</code></li>
<li>300ms 后备定时器：若 300ms 内未收到进度事件，自动推进到 step=1</li>
</ul>
<h2 id="关键实现" tabindex="-1"><a class="header-anchor" href="#关键实现"><span>关键实现</span></a></h2>
<h3 id="splashscreen-html" tabindex="-1"><a class="header-anchor" href="#splashscreen-html"><span>splashscreen.html</span></a></h3>
<p>所有样式和逻辑内联在 HTML 文件中，无外部 CSS/JS 依赖。</p>
<h3 id="进度事件" tabindex="-1"><a class="header-anchor" href="#进度事件"><span>进度事件</span></a></h3>
<p>由 <code v-pre>init.js</code> 中的 <code v-pre>app_emit_splash_progress(step, message)</code> 发送，载荷格式：</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts" data-title="ts"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    step<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>    <span class="token comment">// 0-5 进度步骤，-1 为诊断信息</span></span>
<span class="line">    message<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> <span class="token comment">// 当前步骤的本地化文字</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="加载步骤" tabindex="-1"><a class="header-anchor" href="#加载步骤"><span>加载步骤</span></a></h3>
<table>
<thead>
<tr>
<th>step</th>
<th>progress</th>
<th>默认文字</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>10%</td>
<td>正在初始化...</td>
<td>国际化、DOM、画布、事件</td>
</tr>
<tr>
<td>1</td>
<td>30%</td>
<td>正在加载设置...</td>
<td>设置和缓存</td>
</tr>
<tr>
<td>2</td>
<td>50%</td>
<td>正在加载主题...</td>
<td>主题系统</td>
</tr>
<tr>
<td>3</td>
<td>70%</td>
<td>正在初始化摄像头...</td>
<td>摄像头枚举和初始化</td>
</tr>
<tr>
<td>4</td>
<td>90%</td>
<td>正在完成...</td>
<td>收尾处理</td>
</tr>
<tr>
<td>5</td>
<td>100%</td>
<td>(空)</td>
<td>完成，关闭闪屏</td>
</tr>
</tbody>
</table>
<h3 id="rust-命令" tabindex="-1"><a class="header-anchor" href="#rust-命令"><span>Rust 命令</span></a></h3>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>main_signal_loaded()</code></td>
<td>标记主窗口脚本已加载（AtomicBool = true）</td>
</tr>
<tr>
<td><code v-pre>main_check_loaded() → bool</code></td>
<td>检查主窗口脚本是否已加载</td>
</tr>
<tr>
<td><code v-pre>window_hide_splashscreen()</code></td>
<td>关闭闪屏，显示主窗口</td>
</tr>
</tbody>
</table>
<h3 id="首次运行-oobe-特殊路径" tabindex="-1"><a class="header-anchor" href="#首次运行-oobe-特殊路径"><span>首次运行（OOBE）特殊路径</span></a></h3>
<p>当首次运行时，Rust <code v-pre>setup()</code> 回调检测到 <code v-pre>config.json</code> 不存在：</p>
<ol>
<li><code v-pre>OOBE_ACTIVE = true</code></li>
<li>动态创建 <code v-pre>oobe</code> 窗口</li>
<li>立即关闭 <code v-pre>splashscreen</code> 窗口</li>
<li>前端 <code v-pre>main_init_all()</code> 检测到 OOBE 激活后直接返回，不继续初始化</li>
</ol>
</div></template>


