<template><div><h1 id="pdf-文档展示" tabindex="-1"><a class="header-anchor" href="#pdf-文档展示"><span>PDF/文档展示</span></a></h1>
<h2 id="功能概述" tabindex="-1"><a class="header-anchor" href="#功能概述"><span>功能概述</span></a></h2>
<p>ViewStage 支持导入和展示 PDF 文档以及 Word 文档（.doc/.docx），使用 PDF.js 在浏览器中渲染 PDF，使用 mammoth.js 和 Office COM 接口处理 Word 文档。</p>
<h2 id="pdf-文档" tabindex="-1"><a class="header-anchor" href="#pdf-文档"><span>PDF 文档</span></a></h2>
<h3 id="渲染引擎" tabindex="-1"><a class="header-anchor" href="#渲染引擎"><span>渲染引擎</span></a></h3>
<p>使用 <a href="https://mozilla.github.io/pdf.js/" target="_blank" rel="noopener noreferrer">PDF.js<ExternalLinkIcon/></a> 进行 PDF 渲染。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// PDF.js 配置（main.js）</span></span>
<span class="line">pdfjsLib<span class="token punctuation">.</span>GlobalWorkerOptions<span class="token punctuation">.</span>workerSrc <span class="token operator">=</span> <span class="token string">'JS/pdf.worker.min.js'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="渲染策略" tabindex="-1"><a class="header-anchor" href="#渲染策略"><span>渲染策略</span></a></h3>
<p>ViewStage 采用两种渲染策略：</p>
<ol>
<li><strong>懒加载渲染</strong> (<code v-pre>main_render_pdf_pages_lazy</code>): 首屏渲染前 N 页，其余页面按需加载</li>
<li><strong>并行批处理渲染</strong> (<code v-pre>main_render_pdf_pages_parallel</code>): 分批并行渲染，每批 4 页</li>
</ol>
<h3 id="pdf-缓存" tabindex="-1"><a class="header-anchor" href="#pdf-缓存"><span>PDF 缓存</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> <span class="token constant">MAX_PDF_CACHE</span> <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span> <span class="token comment">// 最多缓存 10 个 PDF 文档对象</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>超过缓存上限时，会自动移除最早的文档并释放 Blob URL。</p>
<h3 id="渲染参数" tabindex="-1"><a class="header-anchor" href="#渲染参数"><span>渲染参数</span></a></h3>
<ul>
<li><code v-pre>pdfScale</code>: PDF 渲染缩放比例（可在设置中调整，默认 2x）</li>
<li>输出格式：JPEG（quality 0.85）</li>
<li>每页生成 Blob URL 用于展示</li>
</ul>
<h2 id="word-文档" tabindex="-1"><a class="header-anchor" href="#word-文档"><span>Word 文档</span></a></h2>
<h3 id="转换流程" tabindex="-1"><a class="header-anchor" href="#转换流程"><span>转换流程</span></a></h3>
<p>Word 文档支持通过以下方式转换：</p>
<ol>
<li><strong>Microsoft Word</strong>: COM 接口调用 PowerShell 脚本转换</li>
<li><strong>WPS Office</strong>: COM 接口调用 PowerShell 脚本转换</li>
<li><strong>LibreOffice</strong>: 命令行调用 soffice 转换</li>
</ol>
<p>检测优先级：Word &gt; WPS &gt; LibreOffice</p>
<h3 id="office-检测" tabindex="-1"><a class="header-anchor" href="#office-检测"><span>Office 检测</span></a></h3>
<p>通过注册表检测已安装的 Office 软件：</p>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs" data-title="rs"><pre v-pre><code><span class="line"><span class="token comment">// Rust 后端（lib.rs）</span></span>
<span class="line"><span class="token class-name">OfficeDetectionResult</span> <span class="token punctuation">{</span></span>
<span class="line">    has_word<span class="token punctuation">:</span> <span class="token keyword">bool</span><span class="token punctuation">,</span></span>
<span class="line">    has_wps<span class="token punctuation">:</span> <span class="token keyword">bool</span><span class="token punctuation">,</span></span>
<span class="line">    has_libreoffice<span class="token punctuation">:</span> <span class="token keyword">bool</span><span class="token punctuation">,</span></span>
<span class="line">    recommended<span class="token punctuation">:</span> <span class="token class-name">OfficeSoftware</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="转换流程-1" tabindex="-1"><a class="header-anchor" href="#转换流程-1"><span>转换流程</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">Word 文件 → 读取文件数据 → 调用 Office COM 转换</span>
<span class="line">  → 生成临时 PDF → 缓存到 app cache 目录</span>
<span class="line">  → PDF.js 加载渲染 → 显示</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


