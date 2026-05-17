<template><div><h1 id="快速入门" tabindex="-1"><a class="header-anchor" href="#快速入门"><span>快速入门</span></a></h1>
<h2 id="系统要求" tabindex="-1"><a class="header-anchor" href="#系统要求"><span>系统要求</span></a></h2>
<h3 id="操作系统" tabindex="-1"><a class="header-anchor" href="#操作系统"><span>操作系统</span></a></h3>
<ul>
<li><strong>Windows</strong>: Windows 10 或更高版本</li>
<li><strong>运行时</strong>: WebView2 运行时（<a href="https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section" target="_blank" rel="noopener noreferrer">下载地址<ExternalLinkIcon/></a>）</li>
</ul>
<h3 id="硬件要求" tabindex="-1"><a class="header-anchor" href="#硬件要求"><span>硬件要求</span></a></h3>
<ul>
<li><strong>摄像头</strong>: 支持视频采集的摄像头设备（用于展台功能）</li>
<li><strong>内存</strong>: 建议 4GB 以上</li>
<li><strong>存储</strong>: 约 50MB 可用空间</li>
</ul>
<h3 id="可选依赖" tabindex="-1"><a class="header-anchor" href="#可选依赖"><span>可选依赖</span></a></h3>
<ul>
<li><strong>Microsoft Office</strong> 或 <strong>WPS Office</strong>: 用于打开 Word 文档（.doc/.docx）</li>
</ul>
<h2 id="下载安装" tabindex="-1"><a class="header-anchor" href="#下载安装"><span>下载安装</span></a></h2>
<p>从 <a href="https://github.com/ospneam/ViewStage/releases" target="_blank" rel="noopener noreferrer">GitHub Releases<ExternalLinkIcon/></a> 下载最新版本的安装包，运行安装即可。</p>
<blockquote>
<p>安装过程中会提示安装 WebView2 运行时（如未安装），请按提示完成安装。</p>
</blockquote>
<h2 id="首次启动" tabindex="-1"><a class="header-anchor" href="#首次启动"><span>首次启动</span></a></h2>
<ol>
<li>启动应用后，会先显示 OOBE 引导界面</li>
<li>选择语言（简体中文 / 繁體中文 / English）</li>
<li>完成基本设置后，应用将自动重启并进入主界面</li>
</ol>
<h2 id="开发环境搭建" tabindex="-1"><a class="header-anchor" href="#开发环境搭建"><span>开发环境搭建</span></a></h2>
<h3 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖"><span>安装依赖</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token comment"># Node.js（推荐 20.x）</span></span>
<span class="line"><span class="token comment"># Rust（稳定版）</span></span>
<span class="line"><span class="token comment"># Tauri CLI</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cargo</span> <span class="token function">install</span> tauri-cli <span class="token parameter variable">--version</span> <span class="token string">"^2.0"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="克隆并运行" tabindex="-1"><a class="header-anchor" href="#克隆并运行"><span>克隆并运行</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> clone https://github.com/ospneam/ViewStage.git</span>
<span class="line"><span class="token builtin class-name">cd</span> ViewStage</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 开发模式运行</span></span>
<span class="line"><span class="token function">cargo</span> tauri dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 构建发布</span></span>
<span class="line"><span class="token function">cargo</span> tauri build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="主界面布局" tabindex="-1"><a class="header-anchor" href="#主界面布局"><span>主界面布局</span></a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">┌──────────────────────────────────────────────┐</span>
<span class="line">│              画布区域 (Canvas)                 │</span>
<span class="line">│  ┌────────────────────────────────────────┐  │</span>
<span class="line">│  │ 图像层 (imageElement)                   │  │</span>
<span class="line">│  │ 批注层 (drawCanvas)                     │  │</span>
<span class="line">│  │ 摄像头层 (cameraVideo)                  │  │</span>
<span class="line">│  └────────────────────────────────────────┘  │</span>
<span class="line">├──────────────────────────────────────────────┤</span>
<span class="line">│  工具栏 (Toolbar)                             │</span>
<span class="line">│  移动 │ 批注 │ 橡皮 │ 撤销 │ 清空 │ 拍照 ... │</span>
<span class="line">└──────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


