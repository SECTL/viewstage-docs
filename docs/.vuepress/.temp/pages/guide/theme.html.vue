<template><div><h1 id="主题系统" tabindex="-1"><a class="header-anchor" href="#主题系统"><span>主题系统</span></a></h1>
<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2>
<p>ViewStage 的主题系统采用<strong>模块化架构</strong>，支持内置主题和用户自定义主题。每个主题是一个独立目录，包含主题配置、样式表和图标集合。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">themes/</span>
<span class="line">├── theme.js              # 主题管理器（核心引擎，204行）</span>
<span class="line">├── simplify/             # 简化主题（默认）</span>
<span class="line">│   ├── theme.js          # 主题模块 - 导出配置与 API（57行）</span>
<span class="line">│   ├── theme.json        # 主题元数据配置（40行）</span>
<span class="line">│   ├── theme.css         # 主界面样式表（1413行）</span>
<span class="line">│   ├── settings.css      # 设置页面样式表（549行）</span>
<span class="line">│   └── icons/            # SVG 图标集合（26个）</span>
<span class="line">└── dark/                 # 深色主题</span>
<span class="line">    ├── theme.js          # 主题模块（57行）</span>
<span class="line">    ├── theme.json        # 主题元数据配置（40行）</span>
<span class="line">    ├── theme.css         # 主界面样式表（1413行）</span>
<span class="line">    ├── settings.css      # 设置页面样式表（549行）</span>
<span class="line">    └── icons/            # SVG 图标集合（26个，与 simplify 共用文件名）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="架构设计" tabindex="-1"><a class="header-anchor" href="#架构设计"><span>架构设计</span></a></h2>
<h3 id="核心原则" tabindex="-1"><a class="header-anchor" href="#核心原则"><span>核心原则</span></a></h3>
<ul>
<li><strong>CSS 变量驱动</strong>：所有颜色、间距、圆角、阴影通过 <code v-pre>:root</code> 中的 CSS 自定义属性定义，主题 CSS 文件覆盖这些变量</li>
<li><strong>模块化加载</strong>：内置主题通过 ES Module <code v-pre>import()</code> 动态加载，用户主题通过 <code v-pre>convertFileSrc</code> 加载</li>
<li><strong>自动检测页面类型</strong>：自动判断当前页面是主界面还是设置页面，加载对应的 CSS 文件</li>
</ul>
<h3 id="主题管理器状态" tabindex="-1"><a class="header-anchor" href="#主题管理器状态"><span>主题管理器状态</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> ThemeManager <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">currentTheme</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>         <span class="token comment">// 当前主题名称（字符串）</span></span>
<span class="line">    <span class="token literal-property property">currentThemeModule</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>   <span class="token comment">// 当前主题模块（对象，含 load_theme 等方法）</span></span>
<span class="line">    <span class="token literal-property property">userThemePath</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>        <span class="token comment">// 用户主题目录路径（从 Rust 后端获取）</span></span>
<span class="line">    <span class="token literal-property property">isSettingsPage</span><span class="token operator">:</span> <span class="token boolean">false</span>       <span class="token comment">// 是否为设置页面（影响加载的 CSS）</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="内置主题-vs-用户主题加载差异" tabindex="-1"><a class="header-anchor" href="#内置主题-vs-用户主题加载差异"><span>内置主题 vs 用户主题加载差异</span></a></h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>内置主题</th>
<th>用户主题</th>
</tr>
</thead>
<tbody>
<tr>
<td>加载方式</td>
<td><code v-pre>import(\</code>./${name}/theme.js`)` 动态导入</td>
<td><code v-pre>fs.readTextFile()</code> + <code v-pre>convertFileSrc()</code></td>
</tr>
<tr>
<td>CSS 加载</td>
<td>通过 <code v-pre>theme.js</code> 创建 <code v-pre>&lt;link&gt;</code> 元素</td>
<td>同左</td>
</tr>
<tr>
<td><code v-pre>settings.css</code></td>
<td>支持（自动加载）</td>
<td>不支持</td>
</tr>
<tr>
<td>图标路径</td>
<td>相对路径 <code v-pre>../repeat(depth)</code></td>
<td><code v-pre>convertFileSrc()</code> 转换的绝对路径</td>
</tr>
<tr>
<td><code v-pre>theme.json</code> 获取</td>
<td><code v-pre>fetch()</code></td>
<td><code v-pre>fs.readTextFile()</code> + <code v-pre>JSON.parse()</code></td>
</tr>
</tbody>
</table>
<h2 id="主题管理器-api" tabindex="-1"><a class="header-anchor" href="#主题管理器-api"><span>主题管理器 API</span></a></h2>
<h3 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化"><span>初始化</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">ThemeManager<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span>themeName<span class="token operator">?</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>从设置中读取已保存的主题名并加载。若不传参，自动通过 <code v-pre>settings_fetch_all</code> 获取。</p>
<h3 id="核心方法" tabindex="-1"><a class="header-anchor" href="#核心方法"><span>核心方法</span></a></h3>
<table>
<thead>
<tr>
<th>方法</th>
<th>返回值</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>theme_update_active(name)</code></td>
<td><code v-pre>Promise&lt;void&gt;</code></td>
<td>加载并激活主题（内置动态 import / 用户目录读取 → CSS 注入 → 图标加载）</td>
</tr>
<tr>
<td><code v-pre>theme_fetch_current()</code></td>
<td><code v-pre>string</code></td>
<td>返回当前主题名称</td>
</tr>
<tr>
<td><code v-pre>theme_fetch_saved()</code></td>
<td><code v-pre>Promise&lt;string&gt;</code></td>
<td>从设置读取已保存主题（默认 <code v-pre>'simplify'</code>）</td>
</tr>
<tr>
<td><code v-pre>theme_validate_builtin(name)</code></td>
<td><code v-pre>boolean</code></td>
<td>检查是否内置主题（白名单：<code v-pre>['dark', 'simplify']</code>）</td>
</tr>
<tr>
<td><code v-pre>theme_validate_user(dir)</code></td>
<td><code v-pre>Promise&lt;boolean&gt;</code></td>
<td>检查用户主题目录是否存在 <code v-pre>theme.json</code></td>
</tr>
</tbody>
</table>
<h3 id="配置查询方法" tabindex="-1"><a class="header-anchor" href="#配置查询方法"><span>配置查询方法</span></a></h3>
<table>
<thead>
<tr>
<th>方法</th>
<th>返回值</th>
<th>默认值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>theme_fetch_canvas_bg_color()</code></td>
<td><code v-pre>string</code> (CSS 颜色)</td>
<td><code v-pre>'#2a2a2a'</code></td>
</tr>
<tr>
<td><code v-pre>theme_fetch_toolbar_text()</code></td>
<td><code v-pre>boolean</code></td>
<td><code v-pre>true</code>（显示文字）</td>
</tr>
<tr>
<td><code v-pre>theme_fetch_no_camera_style()</code></td>
<td><code v-pre>object</code></td>
<td>见下方</td>
</tr>
<tr>
<td><code v-pre>theme_fetch_aurora_effect()</code></td>
<td><code v-pre>boolean</code></td>
<td><code v-pre>true</code>（启用极光）</td>
</tr>
</tbody>
</table>
<p><strong><code v-pre>no_camera_style</code> 默认值：</strong></p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">textColor</span><span class="token operator">:</span> <span class="token string">'#ffffff'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">secondaryTextColor</span><span class="token operator">:</span> <span class="token string">'rgba(255,255,255,0.8)'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">tertiaryTextColor</span><span class="token operator">:</span> <span class="token string">'rgba(255,255,255,0.5)'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">textShadow</span><span class="token operator">:</span> <span class="token string">'0 1px 3px rgba(0,0,0,0.5)'</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="图标方法" tabindex="-1"><a class="header-anchor" href="#图标方法"><span>图标方法</span></a></h3>
<table>
<thead>
<tr>
<th>方法</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>theme_fetch_icon_path(name)</code></td>
<td>返回 SVG 图标的完整路径</td>
</tr>
<tr>
<td><code v-pre>theme_fetch_icon(name, options?)</code></td>
<td>返回 <code v-pre>&lt;img&gt;</code> HTML 标签字符串（options: width, height, alt, style）</td>
</tr>
<tr>
<td><code v-pre>theme_load_icons()</code></td>
<td>扫描所有 <code v-pre>[data-icon]</code> 元素，自动设置 <code v-pre>src</code> 属性</td>
</tr>
</tbody>
</table>
<h3 id="工具栏文字控制" tabindex="-1"><a class="header-anchor" href="#工具栏文字控制"><span>工具栏文字控制</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">ThemeManager<span class="token punctuation">.</span><span class="token function">theme_update_toolbar_text_visibility</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>根据 <code v-pre>theme_fetch_toolbar_text()</code> 返回值，在 <code v-pre>.toolbar</code> 元素上添加/移除 <code v-pre>.hide-text</code> 类。</p>
<h2 id="加载流程" tabindex="-1"><a class="header-anchor" href="#加载流程"><span>加载流程</span></a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">ThemeManager.init()</span>
<span class="line">  → theme_fetch_saved()            // 从设置获取已保存的主题名</span>
<span class="line">  → theme_update_active(name)</span>
<span class="line">      ├── theme_validate_builtin() // 是否是内置主题？</span>
<span class="line">      │   ├── 是 → 直接动态 import(`./${name}/theme.js`)</span>
<span class="line">      │   └── 否 → theme_validate_user() → theme_load_user()</span>
<span class="line">      ├── currentThemeModule.load_theme(isSettingsPage)</span>
<span class="line">      │   ├── 主界面 → 加载 theme.css</span>
<span class="line">      │   └── 设置页 → 加载 settings.css</span>
<span class="line">      ├── theme_update_toolbar_text_visibility()</span>
<span class="line">      └── theme_load_icons()</span>
<span class="line">          // 扫描 DOM 中的 [data-icon] 元素并设置图标</span>
<span class="line"></span>
<span class="line">自动初始化：</span>
<span class="line">  DOMContentLoaded → ThemeManager.init()</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="theme-json-配置详解" tabindex="-1"><a class="header-anchor" href="#theme-json-配置详解"><span>theme.json 配置详解</span></a></h2>
<h3 id="所有字段" tabindex="-1"><a class="header-anchor" href="#所有字段"><span>所有字段</span></a></h3>
<table>
<thead>
<tr>
<th>字段</th>
<th>类型</th>
<th>必需</th>
<th>默认值</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>name</code></td>
<td>string</td>
<td>是</td>
<td>-</td>
<td>主题标识名，与目录名一致</td>
</tr>
<tr>
<td><code v-pre>displayName</code></td>
<td>string</td>
<td>是</td>
<td>-</td>
<td>显示名称，在设置面板中展示</td>
</tr>
<tr>
<td><code v-pre>showToolbarText</code></td>
<td>boolean</td>
<td>否</td>
<td><code v-pre>true</code></td>
<td>工具栏按钮是否显示文字标签</td>
</tr>
<tr>
<td><code v-pre>showAuroraEffect</code></td>
<td>boolean</td>
<td>否</td>
<td><code v-pre>true</code></td>
<td>设置/关于页面是否显示极光背景动画</td>
</tr>
<tr>
<td><code v-pre>canvasBgColor</code></td>
<td>string</td>
<td>否</td>
<td><code v-pre>'#2a2a2a'</code></td>
<td>画布区域背景色</td>
</tr>
<tr>
<td><code v-pre>noCameraMessage</code></td>
<td>object</td>
<td>否</td>
<td>见上</td>
<td>无摄像头时的提示文字样式</td>
</tr>
<tr>
<td><code v-pre>icons</code></td>
<td>object</td>
<td>是</td>
<td>-</td>
<td>图标名称到文件名的映射（26项）</td>
</tr>
</tbody>
</table>
<h3 id="icons-字段详解" tabindex="-1"><a class="header-anchor" href="#icons-字段详解"><span>icons 字段详解</span></a></h3>
<p><strong>键名</strong>：逻辑图标名称，在 HTML 中通过 <code v-pre>data-icon</code> 或 <code v-pre>theme_fetch_icon()</code> 引用。</p>
<p><strong>值</strong>：对应的 SVG 文件名（不含 <code v-pre>.svg</code> 扩展名）。</p>
<p>完整图标映射表（26 项）：</p>
<table>
<thead>
<tr>
<th>键</th>
<th>功能</th>
<th>使用位置</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>menu</code></td>
<td>汉堡菜单</td>
<td><code v-pre>index.html</code> — 底部工具栏</td>
</tr>
<tr>
<td><code v-pre>minimize</code></td>
<td>最小化/窗口切换</td>
<td><code v-pre>index.html</code></td>
</tr>
<tr>
<td><code v-pre>move</code></td>
<td>移动模式</td>
<td><code v-pre>index.html</code></td>
</tr>
<tr>
<td><code v-pre>pen</code></td>
<td>画笔模式</td>
<td><code v-pre>index.html</code></td>
</tr>
<tr>
<td><code v-pre>eraser</code></td>
<td>橡皮模式</td>
<td><code v-pre>index.html</code></td>
</tr>
<tr>
<td><code v-pre>undo</code></td>
<td>撤销</td>
<td><code v-pre>index.html</code></td>
</tr>
<tr>
<td><code v-pre>clear</code></td>
<td>清屏</td>
<td><code v-pre>index.html</code></td>
</tr>
<tr>
<td><code v-pre>camera</code></td>
<td>摄像头</td>
<td><code v-pre>index.html</code> — 拍照按钮</td>
</tr>
<tr>
<td><code v-pre>camera-fill</code></td>
<td>摄像头切换</td>
<td><code v-pre>index.html</code> — 切换摄像头源</td>
</tr>
<tr>
<td><code v-pre>settings</code></td>
<td>设置</td>
<td><code v-pre>index.html</code> — 打开设置面板</td>
</tr>
<tr>
<td><code v-pre>scan</code></td>
<td>文档扫描</td>
<td><code v-pre>index.html</code> — 打开扫描面板</td>
</tr>
<tr>
<td><code v-pre>image</code></td>
<td>图片导入</td>
<td><code v-pre>index.html</code> — 侧边栏导入按钮</td>
</tr>
<tr>
<td><code v-pre>file</code></td>
<td>文件列表</td>
<td><code v-pre>index.html</code> — 文件侧边栏</td>
</tr>
<tr>
<td><code v-pre>folder</code></td>
<td>文件夹</td>
<td><code v-pre>settings.html</code> — 设置页图标</td>
</tr>
<tr>
<td><code v-pre>close</code></td>
<td>关闭</td>
<td><code v-pre>index.html</code> — 菜单关闭按钮</td>
</tr>
<tr>
<td><code v-pre>collapse</code></td>
<td>折叠</td>
<td><code v-pre>index.html</code> — 侧边栏折叠按钮</td>
</tr>
<tr>
<td><code v-pre>addFile</code></td>
<td>添加文件</td>
<td><code v-pre>index.html</code> — 文件侧边栏</td>
</tr>
<tr>
<td><code v-pre>word</code></td>
<td>Word 文档</td>
<td><code v-pre>index.html</code> — 文件列表</td>
</tr>
<tr>
<td><code v-pre>pdf</code></td>
<td>PDF 文档</td>
<td><code v-pre>index.html</code> — 文件列表</td>
</tr>
<tr>
<td><code v-pre>app-settings</code></td>
<td>设置页图标</td>
<td><code v-pre>settings.html</code></td>
</tr>
<tr>
<td><code v-pre>doc-scan</code></td>
<td>文档扫描设置</td>
<td><code v-pre>settings.html</code></td>
</tr>
<tr>
<td><code v-pre>canvas</code></td>
<td>画布设置</td>
<td><code v-pre>settings.html</code></td>
</tr>
<tr>
<td><code v-pre>source</code></td>
<td>源管理设置</td>
<td><code v-pre>settings.html</code></td>
</tr>
<tr>
<td><code v-pre>theme-icon</code></td>
<td>主题图标</td>
<td><code v-pre>settings.html</code></td>
</tr>
<tr>
<td><code v-pre>about</code></td>
<td>关于页面</td>
<td><code v-pre>settings.html</code></td>
</tr>
</tbody>
</table>
<h2 id="css-变量系统" tabindex="-1"><a class="header-anchor" href="#css-变量系统"><span>CSS 变量系统</span></a></h2>
<p>主题通过定义 <code v-pre>:root</code> 中的 CSS 自定义属性控制全局样式，这些变量在 <code v-pre>styles.css</code> 中被 130+ 处引用。</p>
<h3 id="颜色变量" tabindex="-1"><a class="header-anchor" href="#颜色变量"><span>颜色变量</span></a></h3>
<table>
<thead>
<tr>
<th>变量名</th>
<th>用途</th>
<th>Simplify</th>
<th>Dark</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>--color-canvas</code></td>
<td>主背景色</td>
<td><code v-pre>#ffffff</code></td>
<td><code v-pre>#1a1a1a</code></td>
</tr>
<tr>
<td><code v-pre>--color-canvas-gradient-start</code></td>
<td>背景渐变起点</td>
<td><code v-pre>#ffffff</code></td>
<td><code v-pre>#1a1a1a</code></td>
</tr>
<tr>
<td><code v-pre>--color-canvas-gradient-end</code></td>
<td>背景渐变终点</td>
<td><code v-pre>#f8f9fa</code></td>
<td><code v-pre>#2a2a2a</code></td>
</tr>
<tr>
<td><code v-pre>--color-primary</code></td>
<td>主要文字/元素色</td>
<td><code v-pre>#111111</code></td>
<td><code v-pre>#ffffff</code></td>
</tr>
<tr>
<td><code v-pre>--color-primary-active</code></td>
<td>主要元素激活态</td>
<td><code v-pre>#242424</code></td>
<td><code v-pre>#e5e5e5</code></td>
</tr>
<tr>
<td><code v-pre>--color-brand-accent</code></td>
<td>品牌强调色</td>
<td><code v-pre>#3b82f6</code></td>
<td><code v-pre>#3b82f6</code></td>
</tr>
<tr>
<td><code v-pre>--color-surface-soft</code></td>
<td>软表面背景</td>
<td><code v-pre>#f8f9fa</code></td>
<td><code v-pre>#2a2a2a</code></td>
</tr>
<tr>
<td><code v-pre>--color-surface-card</code></td>
<td>卡片表面背景</td>
<td><code v-pre>#f5f5f5</code></td>
<td><code v-pre>#2a2a2a</code></td>
</tr>
<tr>
<td><code v-pre>--color-surface-strong</code></td>
<td>强表面/hover 态</td>
<td><code v-pre>#e5e7eb</code></td>
<td><code v-pre>#3a3a3a</code></td>
</tr>
<tr>
<td><code v-pre>--color-surface-elevated</code></td>
<td>抬升表面</td>
<td><code v-pre>#ffffff</code></td>
<td><code v-pre>#3a3a3a</code></td>
</tr>
<tr>
<td><code v-pre>--color-hairline</code></td>
<td>分割线</td>
<td><code v-pre>#e5e7eb</code></td>
<td><code v-pre>rgba(255,255,255,0.1)</code></td>
</tr>
<tr>
<td><code v-pre>--color-hairline-soft</code></td>
<td>软分割线</td>
<td><code v-pre>#f3f4f6</code></td>
<td><code v-pre>rgba(255,255,255,0.05)</code></td>
</tr>
<tr>
<td><code v-pre>--color-ink</code></td>
<td>主要文字色</td>
<td><code v-pre>#111111</code></td>
<td><code v-pre>#ffffff</code></td>
</tr>
<tr>
<td><code v-pre>--color-body</code></td>
<td>正文文字色</td>
<td><code v-pre>#374151</code></td>
<td><code v-pre>#e5e5e5</code></td>
</tr>
<tr>
<td><code v-pre>--color-muted</code></td>
<td>弱化文字色</td>
<td><code v-pre>#6b7280</code></td>
<td><code v-pre>rgba(255,255,255,0.6)</code></td>
</tr>
<tr>
<td><code v-pre>--color-muted-soft</code></td>
<td>更弱文字色</td>
<td><code v-pre>#898989</code></td>
<td><code v-pre>rgba(255,255,255,0.5)</code></td>
</tr>
<tr>
<td><code v-pre>--color-on-primary</code></td>
<td>主要元素上的文字色</td>
<td><code v-pre>#ffffff</code></td>
<td><code v-pre>#111111</code></td>
</tr>
<tr>
<td><code v-pre>--color-success</code></td>
<td>成功色</td>
<td><code v-pre>#10b981</code></td>
<td><code v-pre>#10b981</code></td>
</tr>
<tr>
<td><code v-pre>--color-warning</code></td>
<td>警告色</td>
<td><code v-pre>#f59e0b</code></td>
<td><code v-pre>#f59e0b</code></td>
</tr>
<tr>
<td><code v-pre>--color-error</code></td>
<td>错误色</td>
<td><code v-pre>#ef4444</code></td>
<td><code v-pre>#ef4444</code></td>
</tr>
</tbody>
</table>
<h3 id="圆角变量" tabindex="-1"><a class="header-anchor" href="#圆角变量"><span>圆角变量</span></a></h3>
<table>
<thead>
<tr>
<th>变量名</th>
<th>值</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>--rounded-xs</code></td>
<td><code v-pre>4px</code></td>
<td>极小圆角</td>
</tr>
<tr>
<td><code v-pre>--rounded-sm</code></td>
<td><code v-pre>6px</code></td>
<td>小圆角</td>
</tr>
<tr>
<td><code v-pre>--rounded-md</code></td>
<td><code v-pre>8px</code></td>
<td>中等圆角（默认按钮）</td>
</tr>
<tr>
<td><code v-pre>--rounded-lg</code></td>
<td><code v-pre>12px</code></td>
<td>大圆角（弹窗、工具栏）</td>
</tr>
<tr>
<td><code v-pre>--rounded-xl</code></td>
<td><code v-pre>16px</code></td>
<td>特大圆角</td>
</tr>
<tr>
<td><code v-pre>--rounded-pill</code></td>
<td><code v-pre>9999px</code></td>
<td>胶囊圆角（开关滑块）</td>
</tr>
</tbody>
</table>
<h3 id="间距变量" tabindex="-1"><a class="header-anchor" href="#间距变量"><span>间距变量</span></a></h3>
<table>
<thead>
<tr>
<th>变量名</th>
<th>值</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>--spacing-xxs</code></td>
<td><code v-pre>4px</code></td>
<td>极小间距</td>
</tr>
<tr>
<td><code v-pre>--spacing-xs</code></td>
<td><code v-pre>8px</code></td>
<td>小间距</td>
</tr>
<tr>
<td><code v-pre>--spacing-sm</code></td>
<td><code v-pre>12px</code></td>
<td>中间距</td>
</tr>
<tr>
<td><code v-pre>--spacing-md</code></td>
<td><code v-pre>16px</code></td>
<td>中间距</td>
</tr>
<tr>
<td><code v-pre>--spacing-lg</code></td>
<td><code v-pre>24px</code></td>
<td>大间距</td>
</tr>
<tr>
<td><code v-pre>--spacing-xl</code></td>
<td><code v-pre>32px</code></td>
<td>更大间距</td>
</tr>
<tr>
<td><code v-pre>--spacing-xxl</code></td>
<td><code v-pre>48px</code></td>
<td>最大间距</td>
</tr>
</tbody>
</table>
<h3 id="按钮高度" tabindex="-1"><a class="header-anchor" href="#按钮高度"><span>按钮高度</span></a></h3>
<table>
<thead>
<tr>
<th>变量名</th>
<th>值</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>--btn-height</code></td>
<td><code v-pre>40px</code></td>
<td>普通按钮</td>
</tr>
<tr>
<td><code v-pre>--btn-height-sm</code></td>
<td><code v-pre>32px</code></td>
<td>小按钮</td>
</tr>
<tr>
<td><code v-pre>--btn-height-lg</code></td>
<td><code v-pre>48px</code></td>
<td>大按钮</td>
</tr>
</tbody>
</table>
<h3 id="阴影变量-深色-浅色主题值不同" tabindex="-1"><a class="header-anchor" href="#阴影变量-深色-浅色主题值不同"><span>阴影变量（深色/浅色主题值不同）</span></a></h3>
<table>
<thead>
<tr>
<th>变量名</th>
<th>Simplify</th>
<th>Dark</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>--shadow-sm</code></td>
<td><code v-pre>0 1px 2px rgba(0,0,0,0.05)</code></td>
<td>同</td>
<td>轻微阴影</td>
</tr>
<tr>
<td><code v-pre>--shadow-md</code></td>
<td><code v-pre>0 4px 12px rgba(0,0,0,0.08)</code></td>
<td>同</td>
<td>中等阴影（工具栏、面板）</td>
</tr>
<tr>
<td><code v-pre>--shadow-lg</code></td>
<td><code v-pre>0 8px 32px rgba(0,0,0,0.12)</code></td>
<td>同</td>
<td>大阴影（弹窗、菜单）</td>
</tr>
</tbody>
</table>
<h3 id="滚动条变量" tabindex="-1"><a class="header-anchor" href="#滚动条变量"><span>滚动条变量</span></a></h3>
<table>
<thead>
<tr>
<th>变量名</th>
<th>Simplify</th>
<th>Dark</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>--scrollbar-track</code></td>
<td><code v-pre>rgba(0,0,0,0.05)</code></td>
<td><code v-pre>rgba(255,255,255,0.05)</code></td>
</tr>
<tr>
<td><code v-pre>--scrollbar-thumb</code></td>
<td><code v-pre>rgba(0,0,0,0.2)</code></td>
<td><code v-pre>rgba(255,255,255,0.2)</code></td>
</tr>
<tr>
<td><code v-pre>--scrollbar-thumb-hover</code></td>
<td><code v-pre>rgba(0,0,0,0.3)</code></td>
<td><code v-pre>rgba(255,255,255,0.3)</code></td>
</tr>
</tbody>
</table>
<h2 id="主题生命周期" tabindex="-1"><a class="header-anchor" href="#主题生命周期"><span>主题生命周期</span></a></h2>
<p>完整的主题设置 → 应用流程：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">用户选择主题 (settings.js:1382)</span>
<span class="line">  │</span>
<span class="line">  ▼</span>
<span class="line">settings_save_all_local({ theme: value })</span>
<span class="line">  │</span>
<span class="line">  ├── invoke('settings_save_all')      → Rust 后端持久化到 config.json</span>
<span class="line">  └── emit('settings-changed')          → 通知主窗口</span>
<span class="line">      │</span>
<span class="line">      ▼</span>
<span class="line">main.js (settings-changed 事件监听)</span>
<span class="line">  │</span>
<span class="line">  ├── ThemeManager.theme_update_active(name)</span>
<span class="line">  │   ├── import(`./${name}/theme.js`)   → 加载主题模块</span>
<span class="line">  │   ├── module.load_theme()            → 创建 &lt;link> 注入 CSS</span>
<span class="line">  │   ├── theme_update_toolbar_text_visibility()  → 控制工具栏文字</span>
<span class="line">  │   └── theme_load_icons()             → 更新所有 [data-icon]</span>
<span class="line">  │</span>
<span class="line">  ├── theme_fetch_canvas_bg_color()     → 获取新背景色</span>
<span class="line">  ├── main_update_canvas_bg_color()     → 更新画布背景</span>
<span class="line">  └── theme_fetch_no_camera_style()     → 更新无摄像头提示样式</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>应用启动时：</strong></p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">splashscreen.html</span>
<span class="line">  ├── invoke('settings_fetch_all') → 读取主题设置</span>
<span class="line">  └── body.classList.add('theme-simplify' / 'theme-dark')</span>
<span class="line"></span>
<span class="line">init.js:196</span>
<span class="line">  ├── ThemeManager.theme_update_active(themeName)</span>
<span class="line">  ├── theme_fetch_canvas_bg_color() → 应用到画布</span>
<span class="line">  └── 设置全局 DRAW_CONFIG.canvasBgColor</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="主题对所有-ui-组件的影响" tabindex="-1"><a class="header-anchor" href="#主题对所有-ui-组件的影响"><span>主题对所有 UI 组件的影响</span></a></h2>
<table>
<thead>
<tr>
<th>影响范围</th>
<th>实现机制</th>
<th>关键代码位置</th>
</tr>
</thead>
<tbody>
<tr>
<td>画布背景色</td>
<td><code v-pre>theme_fetch_canvas_bg_color()</code> → <code v-pre>main_update_canvas_bg_color()</code></td>
<td><code v-pre>main.js:862</code>, <code v-pre>init.js:198-200</code></td>
</tr>
<tr>
<td>工具栏文字显示</td>
<td><code v-pre>.toolbar</code> 添加/移除 <code v-pre>.hide-text</code> 类</td>
<td><code v-pre>theme.js:165-174</code>, <code v-pre>theme.css:653-661</code></td>
</tr>
<tr>
<td>无摄像头提示样式</td>
<td>动态设置 textColor / textShadow 等</td>
<td><code v-pre>main.js:866,5038-5040</code></td>
</tr>
<tr>
<td>所有 <code v-pre>[data-icon]</code> 图标</td>
<td><code v-pre>theme_load_icons()</code> 扫描并设置 src</td>
<td><code v-pre>theme.js:189-195</code>, <code v-pre>index.html</code>, <code v-pre>settings.html</code></td>
</tr>
<tr>
<td>工具栏按钮图标</td>
<td><code v-pre>theme_fetch_icon('camera', {...})</code> 动态生成</td>
<td><code v-pre>main.js:3775-3784</code></td>
</tr>
<tr>
<td>侧边栏按钮图标</td>
<td>同上</td>
<td><code v-pre>main.js:3969,3990,4195,4243,4257,4277,4450,4786</code></td>
</tr>
<tr>
<td>菜单图标</td>
<td>同上</td>
<td><code v-pre>main.js:1683,1687</code></td>
</tr>
<tr>
<td>文档扫描页面背景</td>
<td>CSS 变量 <code v-pre>--doc-scan-bg-color</code>, <code v-pre>--doc-scan-preview-bg</code></td>
<td><code v-pre>doc-scan-page.js:79-81</code></td>
</tr>
<tr>
<td>关于页面极光效果</td>
<td><code v-pre>theme_fetch_aurora_effect()</code> 控制动画</td>
<td><code v-pre>settings.js:2136-2143</code></td>
</tr>
<tr>
<td>启动屏背景</td>
<td>body 类名 <code v-pre>theme-simplify</code> / <code v-pre>theme-dark</code></td>
<td><code v-pre>splashscreen.html:181-188</code></td>
</tr>
<tr>
<td>设置页面样式</td>
<td><code v-pre>settings.css</code> 独立加载</td>
<td><code v-pre>settings.html</code></td>
</tr>
<tr>
<td>OOBE 实时预览</td>
<td>选择主题时立即调用 <code v-pre>theme_update_active()</code></td>
<td><code v-pre>oobe.js:324-327</code></td>
</tr>
<tr>
<td>全局 CSS 变量</td>
<td><code v-pre>:root</code> 中的 <code v-pre>--color-*</code>, <code v-pre>--spacing-*</code> 等</td>
<td><code v-pre>styles.css:1-49</code>（130+ 处引用）</td>
</tr>
</tbody>
</table>
<h2 id="内置主题对比" tabindex="-1"><a class="header-anchor" href="#内置主题对比"><span>内置主题对比</span></a></h2>
<h3 id="简化主题-simplify-—-默认" tabindex="-1"><a class="header-anchor" href="#简化主题-simplify-—-默认"><span>简化主题 (simplify) — 默认</span></a></h3>
<table>
<thead>
<tr>
<th>属性</th>
<th>值</th>
</tr>
</thead>
<tbody>
<tr>
<td>画布背景色</td>
<td><code v-pre>#ffffff</code></td>
</tr>
<tr>
<td>显示工具栏文字</td>
<td>否（<code v-pre>showToolbarText: false</code>）</td>
</tr>
<tr>
<td>极光效果</td>
<td>否（<code v-pre>showAuroraEffect: false</code>）</td>
</tr>
<tr>
<td>图标滤镜</td>
<td>无（正常显示）</td>
</tr>
<tr>
<td>加载遮罩背景</td>
<td><code v-pre>rgba(255, 255, 255, 0.9)</code></td>
</tr>
<tr>
<td>开关选中色</td>
<td><code v-pre>--color-primary</code>（<code v-pre>#111111</code>）</td>
</tr>
</tbody>
</table>
<h3 id="深色主题-dark" tabindex="-1"><a class="header-anchor" href="#深色主题-dark"><span>深色主题 (dark)</span></a></h3>
<table>
<thead>
<tr>
<th>属性</th>
<th>值</th>
</tr>
</thead>
<tbody>
<tr>
<td>画布背景色</td>
<td><code v-pre>#1a1a1a</code></td>
</tr>
<tr>
<td>显示工具栏文字</td>
<td>否（<code v-pre>showToolbarText: false</code>）</td>
</tr>
<tr>
<td>极光效果</td>
<td>否（<code v-pre>showAuroraEffect: false</code>）</td>
</tr>
<tr>
<td>图标滤镜</td>
<td><code v-pre>.toolbar-btn img { filter: invert(1) !important }</code></td>
</tr>
<tr>
<td>加载遮罩背景</td>
<td><code v-pre>rgba(26, 26, 26, 0.9)</code></td>
</tr>
<tr>
<td>开关选中色</td>
<td><code v-pre>--color-brand-accent</code>（<code v-pre>#3b82f6</code>）</td>
</tr>
</tbody>
</table>
<h3 id="关键-css-差异" tabindex="-1"><a class="header-anchor" href="#关键-css-差异"><span>关键 CSS 差异</span></a></h3>
<p>深色主题相比简化主题的主要差异：</p>
<ol>
<li><strong>颜色值反转</strong> — 所有 <code v-pre>--color-*</code> 变量使用浅色值（<code v-pre>#ffffff</code> 系）替代深色值（<code v-pre>#111111</code> 系）</li>
<li><strong>分割线</strong> — <code v-pre>--color-hairline</code> 使用 <code v-pre>rgba(255,255,255,0.1)</code> 半透明而非实色</li>
<li><strong>图标反转</strong> — <code v-pre>.toolbar-btn img</code> 和 <code v-pre>.sidebar-import-btn img</code> 等元素添加 <code v-pre>filter: invert(1) !important</code></li>
<li><strong>例外过滤</strong> — <code v-pre>.sidebar-btn .btn-icon img</code>、<code v-pre>.menu-item img</code> 等添加 <code v-pre>filter: none !important</code> 覆盖反转</li>
<li><strong>开关颜色</strong> — <code v-pre>toggle-switch input:checked + .toggle-slider</code> 使用 <code v-pre>--color-brand-accent</code> 而非 <code v-pre>--color-primary</code></li>
</ol>
<h2 id="css-组件对照" tabindex="-1"><a class="header-anchor" href="#css-组件对照"><span>CSS 组件对照</span></a></h2>
<table>
<thead>
<tr>
<th>CSS 类名</th>
<th>组件</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>.toolbar</code></td>
<td>主工具栏</td>
<td>底部工具栏容器，<code v-pre>bottom: 10px</code></td>
</tr>
<tr>
<td><code v-pre>.toolbar-left/center/right</code></td>
<td>工具栏段</td>
<td>三段式布局，center 绝对定位居中</td>
</tr>
<tr>
<td><code v-pre>.toolbar-btn</code></td>
<td>工具栏按钮</td>
<td><code v-pre>40x40px</code>，flex 列布局，带 gap</td>
</tr>
<tr>
<td><code v-pre>.toolbar-btn.active</code></td>
<td>激活态按钮</td>
<td>当前选中的模式按钮</td>
</tr>
<tr>
<td><code v-pre>.toolbar.hide-text</code></td>
<td>无文字工具栏</td>
<td>按钮缩小为 <code v-pre>36x36px</code>，文字 span 隐藏</td>
</tr>
<tr>
<td><code v-pre>.toolbar-separator</code></td>
<td>分割线</td>
<td>1px 宽，24px 高</td>
</tr>
<tr>
<td><code v-pre>.sidebar</code></td>
<td>侧边栏</td>
<td><code v-pre>width: 180px</code>，右侧弹出</td>
</tr>
<tr>
<td><code v-pre>.sidebar.file-sidebar</code></td>
<td>文件侧边栏</td>
<td><code v-pre>width: 220px</code></td>
</tr>
<tr>
<td><code v-pre>.sidebar-image-item</code></td>
<td>图片项</td>
<td>16:9 缩略图，hover 显示蓝色边框</td>
</tr>
<tr>
<td><code v-pre>.sidebar-image-item.active</code></td>
<td>激活图片项</td>
<td>蓝色边框 + box-shadow 光晕</td>
</tr>
<tr>
<td><code v-pre>.sidebar-folder-item</code></td>
<td>文件夹项</td>
<td>横向 flex 布局</td>
</tr>
<tr>
<td><code v-pre>.sidebar-import-btn</code></td>
<td>导入按钮</td>
<td>底部导入按钮，hover 蓝色边框</td>
</tr>
<tr>
<td><code v-pre>.sidebar-btn</code></td>
<td>侧边栏按钮</td>
<td>全宽按钮，带图标和文字</td>
</tr>
<tr>
<td><code v-pre>.sidebar-btn.active</code></td>
<td>激活按钮</td>
<td>蓝色背景</td>
</tr>
<tr>
<td><code v-pre>.sidebar-page-label</code></td>
<td>页码角标</td>
<td>图片底部居中的页码标签</td>
</tr>
<tr>
<td><code v-pre>.sidebar-btn-delete</code></td>
<td>删除按钮</td>
<td><code v-pre>24x24px</code> 红色按钮</td>
</tr>
<tr>
<td><code v-pre>.pen-control-panel</code></td>
<td>画笔控制面板</td>
<td>弹出面板，<code v-pre>visible</code> 类控制显隐</td>
</tr>
<tr>
<td><code v-pre>.pen-color-btn</code></td>
<td>颜色按钮</td>
<td><code v-pre>24x24px</code> 圆形，grid 布局 5x3</td>
</tr>
<tr>
<td><code v-pre>.pen-color-btn.active</code></td>
<td>激活颜色</td>
<td>白色描边 + 外发光</td>
</tr>
<tr>
<td><code v-pre>.slider-wrapper</code></td>
<td>滑块容器</td>
<td><code v-pre>40x50px</code>，<code v-pre>cursor: ns-resize</code></td>
</tr>
<tr>
<td><code v-pre>.triangle-track</code></td>
<td>三角滑块轨道</td>
<td>SVG 三角形背景</td>
</tr>
<tr>
<td><code v-pre>.custom-thumb</code></td>
<td>滑块把手</td>
<td><code v-pre>18x18px</code> 圆形，白色描边</td>
</tr>
<tr>
<td><code v-pre>.settings-panel</code></td>
<td>设置面板</td>
<td>摄像头旋转设置弹出面板</td>
</tr>
<tr>
<td><code v-pre>.doc-scan-panel</code></td>
<td>文档扫描面板</td>
<td>底部右侧弹出，<code v-pre>bottom: 90px</code></td>
</tr>
<tr>
<td><code v-pre>.doc-scan-option</code></td>
<td>扫描复选框</td>
<td>checkbox + label 行</td>
</tr>
<tr>
<td><code v-pre>.menu-popup</code></td>
<td>菜单弹出</td>
<td>底部左侧弹出，<code v-pre>menuSlideUp</code> 动画</td>
</tr>
<tr>
<td><code v-pre>.menu-item</code></td>
<td>菜单项</td>
<td>卡片式列表项，hover 高亮</td>
</tr>
<tr>
<td><code v-pre>.loading-overlay</code></td>
<td>加载遮罩</td>
<td>全屏覆盖，半透明背景</td>
</tr>
<tr>
<td><code v-pre>.loading-spinner</code></td>
<td>加载旋转器</td>
<td>3px 圆环旋转动画</td>
</tr>
<tr>
<td><code v-pre>.error-dialog-overlay</code></td>
<td>错误弹窗遮罩</td>
<td><code v-pre>z-index: 10000</code>，半透明黑色背景</td>
</tr>
<tr>
<td><code v-pre>.error-dialog</code></td>
<td>错误弹窗卡片</td>
<td>圆角毛玻璃卡片</td>
</tr>
<tr>
<td><code v-pre>.error-btn-retry</code></td>
<td>重试按钮</td>
<td>蓝色品牌色背景</td>
</tr>
<tr>
<td><code v-pre>.error-btn-close</code></td>
<td>关闭按钮</td>
<td>灰色背景</td>
</tr>
<tr>
<td><code v-pre>.toggle-switch</code></td>
<td>开关</td>
<td><code v-pre>44x24px</code>，圆角滑块</td>
</tr>
<tr>
<td><code v-pre>.btn-primary</code></td>
<td>主要按钮</td>
<td>纯色填充，<code v-pre>--color-primary</code></td>
</tr>
<tr>
<td><code v-pre>.btn-secondary</code></td>
<td>次要按钮</td>
<td>白色背景，1px 边框</td>
</tr>
<tr>
<td><code v-pre>.btn-icon</code></td>
<td>图标按钮</td>
<td><code v-pre>36x36px</code> 圆形</td>
</tr>
<tr>
<td><code v-pre>.btn-text</code></td>
<td>文字按钮</td>
<td>透明背景，纯文字</td>
</tr>
<tr>
<td><code v-pre>.btn-sm</code></td>
<td>小按钮</td>
<td><code v-pre>32px</code> 高度</td>
</tr>
<tr>
<td><code v-pre>.btn-lg</code></td>
<td>大按钮</td>
<td><code v-pre>48px</code> 高度</td>
</tr>
<tr>
<td><code v-pre>.btn-danger</code></td>
<td>危险按钮</td>
<td>红色背景</td>
</tr>
<tr>
<td><code v-pre>.btn-success</code></td>
<td>成功按钮</td>
<td>绿色背景</td>
</tr>
<tr>
<td><code v-pre>.btn-action</code></td>
<td>操作按钮</td>
<td>蓝色半透明背景</td>
</tr>
<tr>
<td><code v-pre>.btn-reset</code></td>
<td>重置按钮</td>
<td>红色半透明背景</td>
</tr>
<tr>
<td><code v-pre>.btn-close</code></td>
<td>关闭按钮</td>
<td>透明背景，hover 变红圆形</td>
</tr>
<tr>
<td><code v-pre>.modal-btn-confirm</code></td>
<td>模态确认按钮</td>
<td>红色背景</td>
</tr>
<tr>
<td><code v-pre>.modal-btn-cancel</code></td>
<td>模态取消按钮</td>
<td>灰色背景</td>
</tr>
</tbody>
</table>
<h2 id="动画关键帧" tabindex="-1"><a class="header-anchor" href="#动画关键帧"><span>动画关键帧</span></a></h2>
<table>
<thead>
<tr>
<th>动画名</th>
<th>触发</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>sidebarExpand</code></td>
<td>侧边栏打开</td>
<td><code v-pre>translateX(20px) scale(0.95) → translateX(0) scale(1)</code>，0.25s cubic-bezier</td>
</tr>
<tr>
<td><code v-pre>sidebarCollapse</code></td>
<td>侧边栏关闭</td>
<td>反向动画</td>
</tr>
<tr>
<td><code v-pre>menuSlideUp</code></td>
<td>菜单弹出</td>
<td><code v-pre>translateY(10px) → translateY(0)</code>，0.2s ease</td>
</tr>
<tr>
<td><code v-pre>fadeIn</code></td>
<td>启动画面</td>
<td><code v-pre>opacity 0 + translateY(8px) → opacity 1 + translateY(0)</code>，0.4s</td>
</tr>
</tbody>
</table>
<h2 id="创建内置主题" tabindex="-1"><a class="header-anchor" href="#创建内置主题"><span>创建内置主题</span></a></h2>
<p>内置主题位于 <code v-pre>src/themes/{name}/</code> 目录，需要 5 个文件：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">themes/{name}/</span>
<span class="line">├── theme.js        # 主题模块（必需）</span>
<span class="line">├── theme.json      # 主题配置（必需）</span>
<span class="line">├── theme.css       # 主界面样式（必需）</span>
<span class="line">├── settings.css    # 设置页面样式（可选，无则使用主样式）</span>
<span class="line">└── icons/          # SVG 图标集合（必需，26个）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-theme-json-—-主题配置" tabindex="-1"><a class="header-anchor" href="#_1-theme-json-—-主题配置"><span>1. <code v-pre>theme.json</code> — 主题配置</span></a></h3>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"my-theme"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"displayName"</span><span class="token operator">:</span> <span class="token string">"我的主题"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"showToolbarText"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"showAuroraEffect"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"canvasBgColor"</span><span class="token operator">:</span> <span class="token string">"#ffffff"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"noCameraMessage"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"textColor"</span><span class="token operator">:</span> <span class="token string">"#1a1a1a"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"secondaryTextColor"</span><span class="token operator">:</span> <span class="token string">"rgba(0,0,0,0.6)"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"tertiaryTextColor"</span><span class="token operator">:</span> <span class="token string">"rgba(0,0,0,0.4)"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"textShadow"</span><span class="token operator">:</span> <span class="token string">"0 1px 3px rgba(255,255,255,0.5)"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"icons"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"menu"</span><span class="token operator">:</span> <span class="token string">"justify"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"pen"</span><span class="token operator">:</span> <span class="token string">"pen"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"eraser"</span><span class="token operator">:</span> <span class="token string">"eraser"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"camera"</span><span class="token operator">:</span> <span class="token string">"camera"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"settings"</span><span class="token operator">:</span> <span class="token string">"gear"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"image"</span><span class="token operator">:</span> <span class="token string">"file-earmark-medical"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"file"</span><span class="token operator">:</span> <span class="token string">"File"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"folder"</span><span class="token operator">:</span> <span class="token string">"folder"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"close"</span><span class="token operator">:</span> <span class="token string">"arrow-bar-left"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"collapse"</span><span class="token operator">:</span> <span class="token string">"caret-down-fill"</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-theme-js-—-主题模块" tabindex="-1"><a class="header-anchor" href="#_2-theme-js-—-主题模块"><span>2. <code v-pre>theme.js</code> — 主题模块</span></a></h3>
<p>每个内置主题必须导出一个包含以下方法的对象：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> MyTheme <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'my-theme'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">config</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token function">fetch_base_path</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> parts <span class="token operator">=</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>pathname<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">'/'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">p</span> <span class="token operator">=></span> p<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">const</span> depth <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> parts<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token string">'../'</span><span class="token punctuation">.</span><span class="token function">repeat</span><span class="token punctuation">(</span>depth<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ★ 必需：加载主题（CSS 注入）</span></span>
<span class="line">  <span class="token keyword">async</span> <span class="token function">load_theme</span><span class="token punctuation">(</span><span class="token parameter">isSettingsPage <span class="token operator">=</span> <span class="token boolean">false</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> base <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">fetch_base_path</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>base<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">themes/my-theme/theme.json</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>config <span class="token operator">=</span> <span class="token keyword">await</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>isSettingsPage<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 设置页面加载 settings.css</span></span>
<span class="line">      <span class="token keyword">const</span> link <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">'link'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      link<span class="token punctuation">.</span>rel <span class="token operator">=</span> <span class="token string">'stylesheet'</span><span class="token punctuation">;</span></span>
<span class="line">      link<span class="token punctuation">.</span>href <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>base<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">themes/my-theme/settings.css</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span></span>
<span class="line">      document<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>link<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 主界面加载 theme.css</span></span>
<span class="line">      <span class="token keyword">const</span> link <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">'link'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      link<span class="token punctuation">.</span>rel <span class="token operator">=</span> <span class="token string">'stylesheet'</span><span class="token punctuation">;</span></span>
<span class="line">      link<span class="token punctuation">.</span>href <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>base<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">themes/my-theme/theme.css</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span></span>
<span class="line">      document<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>link<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ★ 必需：获取图标路径</span></span>
<span class="line">  <span class="token function">fetch_icon_path</span><span class="token punctuation">(</span><span class="token parameter">iconName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> actualName <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>config<span class="token operator">?.</span>icons<span class="token operator">?.</span><span class="token punctuation">[</span>iconName<span class="token punctuation">]</span> <span class="token operator">||</span> iconName<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">const</span> base <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">fetch_base_path</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>base<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">themes/my-theme/icons/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>actualName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.svg</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 获取工具栏文字显示</span></span>
<span class="line">  <span class="token function">fetch_toolbar_text</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>config<span class="token operator">?.</span>showToolbarText <span class="token operator">!==</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 获取画布背景色</span></span>
<span class="line">  <span class="token function">fetch_canvas_bg_color</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>config<span class="token operator">?.</span>canvasBgColor <span class="token operator">||</span> <span class="token string">'#ffffff'</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 获取无摄像头提示样式</span></span>
<span class="line">  <span class="token function">fetch_no_camera_style</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>config<span class="token operator">?.</span>noCameraMessage <span class="token operator">||</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">textColor</span><span class="token operator">:</span> <span class="token string">'#1a1a1a'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">secondaryTextColor</span><span class="token operator">:</span> <span class="token string">'rgba(0,0,0,0.6)'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tertiaryTextColor</span><span class="token operator">:</span> <span class="token string">'rgba(0,0,0,0.4)'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">textShadow</span><span class="token operator">:</span> <span class="token string">'0 1px 3px rgba(255,255,255,0.5)'</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 获取极光效果</span></span>
<span class="line">  <span class="token function">fetch_aurora_effect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>config<span class="token operator">?.</span>showAuroraEffect <span class="token operator">!==</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> MyTheme<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-theme-css-settings-css-—-样式表" tabindex="-1"><a class="header-anchor" href="#_3-theme-css-settings-css-—-样式表"><span>3. <code v-pre>theme.css</code> / <code v-pre>settings.css</code> — 样式表</span></a></h3>
<p><strong>theme.css</strong> 只覆盖部分或全部 <code v-pre>:root</code> CSS 变量，styles.css 中的 130+ 处引用会自动适配。必须定义所有 <code v-pre>--color-*</code>、<code v-pre>--rounded-*</code>、<code v-pre>--spacing-*</code>、<code v-pre>--shadow-*</code> 变量。</p>
<p><strong>settings.css</strong> 结构与 theme.css 相同但只用于设置页面。</p>
<h3 id="_4-icons-—-svg-图标" tabindex="-1"><a class="header-anchor" href="#_4-icons-—-svg-图标"><span>4. <code v-pre>icons/</code> — SVG 图标</span></a></h3>
<p>每个主题必须有完整的 <code v-pre>icons/</code> 目录，包含 26 个 SVG 图标文件（与 <code v-pre>theme.json</code> 中 <code v-pre>icons</code> 字段的值对应）。可直接从简化主题复制或使用自定义 SVG。</p>
<p>SVG 要求：</p>
<ul>
<li>标准 SVG 格式</li>
<li>建议 16x16 或 24x24 viewBox</li>
<li>使用 <code v-pre>currentColor</code> 以支持动态着色</li>
<li>深色主题中白色图标需使用 <code v-pre>filter: invert(1)</code> 反转</li>
</ul>
<h3 id="_5-注册内置主题" tabindex="-1"><a class="header-anchor" href="#_5-注册内置主题"><span>5. 注册内置主题</span></a></h3>
<p>修改 <code v-pre>src/themes/theme.js:72-75</code>：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token function">theme_validate_builtin</span><span class="token punctuation">(</span><span class="token parameter">themeName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> builtInThemes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'dark'</span><span class="token punctuation">,</span> <span class="token string">'simplify'</span><span class="token punctuation">,</span> <span class="token string">'your-new-theme'</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> builtInThemes<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>themeName<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建自定义主题-用户级" tabindex="-1"><a class="header-anchor" href="#创建自定义主题-用户级"><span>创建自定义主题（用户级）</span></a></h2>
<p>用户可以在不修改应用文件的情况下创建自定义主题。</p>
<h3 id="目录位置" tabindex="-1"><a class="header-anchor" href="#目录位置"><span>目录位置</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">%APPDATA%/SECTL/ViewStage/themes/{theme_name}/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Windows: <code v-pre>C:\Users\{用户名}\AppData\Roaming\SECTL\ViewStage\themes\{theme_name}\</code></p>
<h3 id="必需文件" tabindex="-1"><a class="header-anchor" href="#必需文件"><span>必需文件</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">themes/{theme_name}/</span>
<span class="line">├── theme.json        # 主题配置（必需）</span>
<span class="line">├── theme.css         # 主界面样式（必需）</span>
<span class="line">└── icons/            # 图标集合（可选，缺少的图标使用默认图标）</span>
<span class="line">    ├── move.svg</span>
<span class="line">    └── ...</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="加载原理" tabindex="-1"><a class="header-anchor" href="#加载原理"><span>加载原理</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">theme_update_active('my-custom-theme')</span>
<span class="line">  → theme_validate_builtin('my-custom-theme')  // false</span>
<span class="line">  → dir_fetch_theme → 获取用户主题目录</span>
<span class="line">  → theme_validate_user(themeDir)               // 检查 theme.json 是否存在</span>
<span class="line">  → theme_load_user(themeDir, themeName)         // 加载自定义主题</span>
<span class="line">      → fs.readTextFile('{themeDir}/theme.json')</span>
<span class="line">      → 生成临时主题模块对象</span>
<span class="line">      → load_theme() → convertFileSrc() → 创建 &lt;link> 加载 CSS</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="限制" tabindex="-1"><a class="header-anchor" href="#限制"><span>限制</span></a></h3>
<ul>
<li>不支持 <code v-pre>settings.css</code>，设置页面始终使用当前内置主题的样式</li>
<li>图标映射可选，未配置的图标使用系统默认图标</li>
<li>仅支持 CSS 样式覆盖，不支持 JavaScript 逻辑扩展</li>
<li>主题选择后需重启应用才能完全生效</li>
</ul>
<h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2>
<h3 id="图标全白-深色主题" tabindex="-1"><a class="header-anchor" href="#图标全白-深色主题"><span>图标全白（深色主题）</span></a></h3>
<p>深色主题中 SVG 图标默认通过 <code v-pre>.toolbar-btn img { filter: invert(1) !important }</code> 反转。若某些图标不需要反转，添加 <code v-pre>filter: none !important</code>：</p>
<div class="language-css line-numbers-mode" data-highlighter="prismjs" data-ext="css" data-title="css"><pre v-pre><code><span class="line"><span class="token selector">.sidebar-btn .btn-icon img</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">filter</span><span class="token punctuation">:</span> none <span class="token important">!important</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置页面主题不生效" tabindex="-1"><a class="header-anchor" href="#设置页面主题不生效"><span>设置页面主题不生效</span></a></h3>
<p>设置页面使用 <code v-pre>settings.css</code> 而非 <code v-pre>theme.css</code>。自定义主题不支持 <code v-pre>settings.css</code>，设置页面始终使用内置主题样式。</p>
<h3 id="主题选择后需要重启" tabindex="-1"><a class="header-anchor" href="#主题选择后需要重启"><span>主题选择后需要重启</span></a></h3>
<p>当前设计中，主题变更会触发重启提示（<code v-pre>restartModal</code>），因为部分组件（如摄像头预览）在初始化时读取主题样式，无法热更新。设置页面的 <code v-pre>document.documentElement.style.cssText</code> 方式仅做预览。</p>
<h3 id="css-变量未生效" tabindex="-1"><a class="header-anchor" href="#css-变量未生效"><span>CSS 变量未生效</span></a></h3>
<p>主题 CSS 的 <code v-pre>:root</code> 规则优先级低于 <code v-pre>styles.css</code> 中的 <code v-pre>:root</code> 规则。确保主题 CSS 在 <code v-pre>styles.css</code> 之后加载（<code v-pre>&lt;link&gt;</code> 动态追加到 <code v-pre>&lt;head&gt;</code> 末尾）。若需覆盖，使用相同选择器声明或提高特异性。</p>
</div></template>


