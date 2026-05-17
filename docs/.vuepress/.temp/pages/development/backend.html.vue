<template><div><h1 id="后端架构" tabindex="-1"><a class="header-anchor" href="#后端架构"><span>后端架构</span></a></h1>
<h2 id="技术选型" tabindex="-1"><a class="header-anchor" href="#技术选型"><span>技术选型</span></a></h2>
<p>ViewStage 后端使用 <strong>Rust</strong> 语言，基于 <strong>Tauri 2.0</strong> 框架。</p>
<h2 id="cargo-toml-依赖" tabindex="-1"><a class="header-anchor" href="#cargo-toml-依赖"><span>Cargo.toml 依赖</span></a></h2>
<div class="language-toml line-numbers-mode" data-highlighter="prismjs" data-ext="toml" data-title="toml"><pre v-pre><code><span class="line"><span class="token punctuation">[</span><span class="token table class-name">dependencies</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token key property">tauri</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span> <span class="token key property">version</span> <span class="token punctuation">=</span> <span class="token string">"2"</span><span class="token punctuation">,</span> <span class="token key property">features</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"devtools"</span><span class="token punctuation">]</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token key property">tauri-plugin-opener</span> <span class="token punctuation">=</span> <span class="token string">"2"</span>          <span class="token comment"># 文件打开</span></span>
<span class="line"><span class="token key property">tauri-plugin-fs</span> <span class="token punctuation">=</span> <span class="token string">"2"</span>              <span class="token comment"># 文件系统</span></span>
<span class="line"><span class="token key property">tauri-plugin-dialog</span> <span class="token punctuation">=</span> <span class="token string">"2"</span>          <span class="token comment"># 对话框</span></span>
<span class="line"><span class="token key property">tauri-plugin-single-instance</span> <span class="token punctuation">=</span> <span class="token string">"2"</span> <span class="token comment"># 单实例</span></span>
<span class="line"><span class="token key property">tokio</span> <span class="token punctuation">=</span> <span class="token string">"1"</span>                        <span class="token comment"># 异步运行时</span></span>
<span class="line"><span class="token key property">serde</span> <span class="token punctuation">=</span> <span class="token string">"1"</span>                        <span class="token comment"># 序列化</span></span>
<span class="line"><span class="token key property">serde_json</span> <span class="token punctuation">=</span> <span class="token string">"1"</span>                   <span class="token comment"># JSON</span></span>
<span class="line"><span class="token key property">image</span> <span class="token punctuation">=</span> <span class="token string">"0.25"</span>                     <span class="token comment"># 图像处理</span></span>
<span class="line"><span class="token key property">base64</span> <span class="token punctuation">=</span> <span class="token string">"0.22"</span>                    <span class="token comment"># Base64 编解码</span></span>
<span class="line"><span class="token key property">chrono</span> <span class="token punctuation">=</span> <span class="token string">"0.4"</span>                     <span class="token comment"># 日期时间</span></span>
<span class="line"><span class="token key property">reqwest</span> <span class="token punctuation">=</span> <span class="token string">"0.11"</span>                   <span class="token comment"># HTTP 客户端</span></span>
<span class="line"><span class="token key property">ort</span> <span class="token punctuation">=</span> <span class="token string">"2.0.0-rc.10"</span>               <span class="token comment"># ONNX Runtime</span></span>
<span class="line"><span class="token key property">winreg</span> <span class="token punctuation">=</span> <span class="token string">"0.52"</span>                    <span class="token comment"># Windows 注册表</span></span>
<span class="line"><span class="token key property">dirs</span> <span class="token punctuation">=</span> <span class="token string">"5"</span>                         <span class="token comment"># 系统目录</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心模块" tabindex="-1"><a class="header-anchor" href="#核心模块"><span>核心模块</span></a></h2>
<h3 id="lib-rs-—-核心逻辑-3004-行" tabindex="-1"><a class="header-anchor" href="#lib-rs-—-核心逻辑-3004-行"><span>lib.rs — 核心逻辑 (3004 行)</span></a></h3>
<h4 id="tauri-命令" tabindex="-1"><a class="header-anchor" href="#tauri-命令"><span>Tauri 命令</span></a></h4>
<p><strong>系统目录</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>dir_fetch_cache</code></td>
<td>获取缓存目录</td>
</tr>
<tr>
<td><code v-pre>dir_fetch_config</code></td>
<td>获取配置目录</td>
</tr>
<tr>
<td><code v-pre>dir_fetch_pictures_viewstage</code></td>
<td>获取图片保存目录</td>
</tr>
<tr>
<td><code v-pre>dir_fetch_theme</code></td>
<td>获取主题目录</td>
</tr>
</tbody>
</table>
<p><strong>缓存管理</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>cache_fetch_size</code></td>
<td>获取缓存大小</td>
</tr>
<tr>
<td><code v-pre>cache_delete_all</code></td>
<td>清除所有缓存</td>
</tr>
<tr>
<td><code v-pre>cache_validate_auto_clear</code></td>
<td>检查并自动清除缓存</td>
</tr>
</tbody>
</table>
<p><strong>图像处理</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>image_save_file</code></td>
<td>保存图片文件</td>
</tr>
<tr>
<td><code v-pre>image_update_rotation</code></td>
<td>图片旋转（委托给 <code v-pre>image_processing.rs</code>）</td>
</tr>
</tbody>
</table>
<p><strong>笔画压缩</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>stroke_format_compact</code></td>
<td>将笔画渲染到图片（支持 draw/erase/clear）</td>
</tr>
</tbody>
</table>
<p><strong>设置管理</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>settings_fetch_all</code></td>
<td>获取所有设置（含配置迁移）</td>
</tr>
<tr>
<td><code v-pre>settings_save_all</code></td>
<td>保存设置（原子写入）</td>
</tr>
<tr>
<td><code v-pre>settings_delete_all</code></td>
<td>删除所有设置并重启</td>
</tr>
</tbody>
</table>
<p><strong>Office 转换</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>office_detect_all</code></td>
<td>检测已安装的 Office 软件</td>
</tr>
<tr>
<td><code v-pre>office_convert_docx_to_pdf</code></td>
<td>Word 文档转 PDF</td>
</tr>
<tr>
<td><code v-pre>office_convert_docx_to_pdf_bytes</code></td>
<td>通过字节数据转换</td>
</tr>
</tbody>
</table>
<p><strong>文件关联</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>filetype_set_icons</code></td>
<td>注册文件关联和图标</td>
</tr>
<tr>
<td><code v-pre>filetype_delete_icons</code></td>
<td>删除文件关联</td>
</tr>
<tr>
<td><code v-pre>filetype_validate_pdf_default</code></td>
<td>检查 PDF 默认打开方式</td>
</tr>
</tbody>
</table>
<p><strong>文档扫描</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>scan_process_document</code></td>
<td>完整文档扫描处理</td>
</tr>
<tr>
<td><code v-pre>model_fetch_dbnet_info</code></td>
<td>获取 DBNet 模型信息</td>
</tr>
<tr>
<td><code v-pre>model_download_dbnet</code></td>
<td>下载 DBNet 模型</td>
</tr>
</tbody>
</table>
<p><strong>更新</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>update_fetch_check</code></td>
<td>检查 GitHub 更新</td>
</tr>
<tr>
<td><code v-pre>update_download_file</code></td>
<td>下载更新文件</td>
</tr>
</tbody>
</table>
<p><strong>窗口</strong></p>
<table>
<thead>
<tr>
<th>命令</th>
<th>功能</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>window_show_settings</code></td>
<td>打开设置窗口</td>
</tr>
<tr>
<td><code v-pre>window_show_doc_scan</code></td>
<td>打开文档扫描窗口</td>
</tr>
<tr>
<td><code v-pre>window_hide_splashscreen</code></td>
<td>关闭启动屏</td>
</tr>
</tbody>
</table>
<h3 id="image-processing-rs-—-图像处理" tabindex="-1"><a class="header-anchor" href="#image-processing-rs-—-图像处理"><span>image_processing.rs — 图像处理</span></a></h3>
<ul>
<li><code v-pre>image_load_base64</code>: base64 → DynamicImage</li>
<li><code v-pre>image_fetch_base64_data</code>: base64 → 原始字节</li>
<li><code v-pre>image_update_rotation</code>: 图像旋转（90°/270°）</li>
</ul>
<h2 id="配置迁移系统" tabindex="-1"><a class="header-anchor" href="#配置迁移系统"><span>配置迁移系统</span></a></h2>
<p>配置文件支持版本化迁移：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">config_version: 0 → 1 → 2 (CURRENT_CONFIG_VERSION)</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>迁移自动备份旧配置到 <code v-pre>config.json.backup_v{version}_{timestamp}</code></p>
<h2 id="日志系统" tabindex="-1"><a class="header-anchor" href="#日志系统"><span>日志系统</span></a></h2>
<p>日志文件路径: <code v-pre>%APPDATA%/SECTL/ViewStage/log/viewstage_{YYYYMMDD}.log</code></p>
</div></template>


