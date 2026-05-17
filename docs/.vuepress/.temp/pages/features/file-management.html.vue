<template><div><h1 id="文件管理" tabindex="-1"><a class="header-anchor" href="#文件管理"><span>文件管理</span></a></h1>
<h2 id="源-id-管理系统" tabindex="-1"><a class="header-anchor" href="#源-id-管理系统"><span>源 ID 管理系统</span></a></h2>
<p>ViewStage 采用统一的<strong>源 ID 系统</strong>管理所有信号源（摄像头、图片、PDF 文档），确保切换时保持每个源的独立状态。</p>
<h3 id="源-id-生成" tabindex="-1"><a class="header-anchor" href="#源-id-生成"><span>源 ID 生成</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token function">main_create_source_id</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> pageIndex<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// type: 'cam' | 'pic' | 'doc'</span></span>
<span class="line"><span class="token comment">// 示例: 'cam', 'pic-1', 'doc-2-3'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="源数据存储" tabindex="-1"><a class="header-anchor" href="#源数据存储"><span>源数据存储</span></a></h3>
<p>每个源独立保存以下数据：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">sourceDataStore<span class="token punctuation">[</span>sourceId<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">scale</span><span class="token operator">:</span> number<span class="token punctuation">,</span>           <span class="token comment">// 缩放比例</span></span>
<span class="line">    <span class="token literal-property property">canvasX</span><span class="token operator">:</span> number<span class="token punctuation">,</span>         <span class="token comment">// 画布 X 偏移</span></span>
<span class="line">    <span class="token literal-property property">canvasY</span><span class="token operator">:</span> number<span class="token punctuation">,</span>         <span class="token comment">// 画布 Y 偏移</span></span>
<span class="line">    <span class="token literal-property property">strokeHistory</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>       <span class="token comment">// 批注历史</span></span>
<span class="line">    <span class="token literal-property property">baseImageURL</span><span class="token operator">:</span> string<span class="token punctuation">,</span>    <span class="token comment">// 基础图片</span></span>
<span class="line">    <span class="token literal-property property">timestamp</span><span class="token operator">:</span> number<span class="token punctuation">,</span>       <span class="token comment">// 最后访问时间</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="缓存管理" tabindex="-1"><a class="header-anchor" href="#缓存管理"><span>缓存管理</span></a></h3>
<ul>
<li>最大缓存源数：<code v-pre>MAX_SOURCE_CACHE = 50</code></li>
<li>超限时自动移除最旧的源数据</li>
</ul>
<h2 id="图片管理" tabindex="-1"><a class="header-anchor" href="#图片管理"><span>图片管理</span></a></h2>
<ul>
<li>支持导入图片到图片列表</li>
<li>拍照自动添加到图片列表</li>
<li>图片旋转（90°/270°，通过 Rust 后端处理）</li>
<li>图片列表侧边栏展示</li>
</ul>
<h2 id="pdf-文件管理" tabindex="-1"><a class="header-anchor" href="#pdf-文件管理"><span>PDF 文件管理</span></a></h2>
<ul>
<li>文件列表侧边栏</li>
<li>文件夹按文档名称组织</li>
<li>每页独立管理（源 ID + 页码）</li>
<li>懒加载 + 并行预渲染</li>
<li>翻页自动切换源数据</li>
</ul>
<h2 id="文件关联" tabindex="-1"><a class="header-anchor" href="#文件关联"><span>文件关联</span></a></h2>
<p>ViewStage 支持注册为 PDF 和 Word 文档的默认打开程序：</p>
<ul>
<li><strong>注册</strong>: 创建 ProgID → 关联扩展名 → 设置 UserChoice（Windows 注册表）</li>
<li><strong>取消</strong>: 删除注册表项</li>
<li><strong>图标</strong>: 注册文件类型图标</li>
</ul>
<h2 id="保存路径" tabindex="-1"><a class="header-anchor" href="#保存路径"><span>保存路径</span></a></h2>
<p>拍照和截图保存到 <code v-pre>~/Pictures/ViewStage/</code>：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">~/Pictures/ViewStage/</span>
<span class="line">  └── YYYY-MM-DD/</span>
<span class="line">      ├── photo_HH-MM-SS-mmm.jpg</span>
<span class="line">      └── annotation_HH-MM-SS-mmm.png</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="缓存管理-1" tabindex="-1"><a class="header-anchor" href="#缓存管理-1"><span>缓存管理</span></a></h2>
<p>缓存目录位于 <code v-pre>%APPDATA%/SECTL/ViewStage/cache/</code>：</p>
<ul>
<li>自动清除缓存（可配置天数，默认 15 天）</li>
<li>手动清除缓存</li>
<li>查看缓存大小</li>
</ul>
</div></template>


