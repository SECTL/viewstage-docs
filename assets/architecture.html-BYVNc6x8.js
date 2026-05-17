import{_ as n,a as e,b as a,o as i}from"./app-CIG19zjz.js";const l={};function t(d,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<h1 id="项目架构" tabindex="-1"><a class="header-anchor" href="#项目架构"><span>项目架构</span></a></h1><h2 id="整体架构" tabindex="-1"><a class="header-anchor" href="#整体架构"><span>整体架构</span></a></h2><p>ViewStage 采用 <strong>Tauri 2.0</strong> 架构，前端使用原生 Web 技术栈，后端使用 Rust。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────┐</span>
<span class="line">│              前端 (WebView2)              │</span>
<span class="line">│  ┌───────────────────────────────────┐  │</span>
<span class="line">│  │    main.js (主逻辑)                │  │</span>
<span class="line">│  │    init.js (初始化)                │  │</span>
<span class="line">│  │    history.js (撤销系统)           │  │</span>
<span class="line">│  │    batch-draw.js (批量绘制)        │  │</span>
<span class="line">│  │    i18n.js (国际化)                │  │</span>
<span class="line">│  │    pen_tessellator.js (笔锋)       │  │</span>
<span class="line">│  │    settings.js (设置)              │  │</span>
<span class="line">│  │    doc-scan/ (文档扫描)            │  │</span>
<span class="line">│  │    themes/ (主题系统)              │  │</span>
<span class="line">│  └───────────────────────────────────┘  │</span>
<span class="line">├─────────────────────────────────────────┤</span>
<span class="line">│           IPC (invoke/event)             │</span>
<span class="line">├─────────────────────────────────────────┤</span>
<span class="line">│           后端 (Rust + Tauri)            │</span>
<span class="line">│  ┌───────────────────────────────────┐  │</span>
<span class="line">│  │  lib.rs (核心逻辑)                │  │</span>
<span class="line">│  │  image_processing.rs (图像处理)    │  │</span>
<span class="line">│  │  main.rs (入口)                    │  │</span>
<span class="line">│  └───────────────────────────────────┘  │</span>
<span class="line">└─────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="前端架构" tabindex="-1"><a class="header-anchor" href="#前端架构"><span>前端架构</span></a></h2><h3 id="核心文件说明" tabindex="-1"><a class="header-anchor" href="#核心文件说明"><span>核心文件说明</span></a></h3><table><thead><tr><th>文件</th><th>路径</th><th>功能</th></tr></thead><tbody><tr><td><code>index.html</code></td><td><code>src/index.html</code></td><td>主界面 HTML 入口</td></tr><tr><td><code>main.js</code></td><td><code>src/main.js</code></td><td>核心逻辑：画笔、画布变换、PDF 加载、源管理</td></tr><tr><td><code>init.js</code></td><td><code>src/init.js</code></td><td>应用初始化：DOM、Canvas、设置加载、摄像头</td></tr><tr><td><code>history.js</code></td><td><code>src/history.js</code></td><td>命令模式实现的撤销/重做系统</td></tr><tr><td><code>batch-draw.js</code></td><td><code>src/batch-draw.js</code></td><td>实时批量绘制管理器，RAF 调度</td></tr><tr><td><code>i18n.js</code></td><td><code>src/i18n.js</code></td><td>国际化系统</td></tr><tr><td><code>pen_tessellator.js</code></td><td><code>src/pen_tessellator.js</code></td><td>钢笔笔锋曲面细分算法</td></tr><tr><td><code>settings.html/js</code></td><td><code>src/settings.*</code></td><td>设置页面</td></tr><tr><td><code>oobe.html/js</code></td><td><code>src/oobe.*</code></td><td>首次运行引导页面</td></tr></tbody></table><h3 id="数据流" tabindex="-1"><a class="header-anchor" href="#数据流"><span>数据流</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">用户操作 → 事件监听 → main.js (状态更新)</span>
<span class="line">              ↓</span>
<span class="line">      batch-draw.js (RAF批量渲染)</span>
<span class="line">              ↓</span>
<span class="line">      Canvas 2D API (drawCanvas)</span>
<span class="line">              ↓</span>
<span class="line">      (可选) Rust backend (图像保存/处理)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="后端架构" tabindex="-1"><a class="header-anchor" href="#后端架构"><span>后端架构</span></a></h2><h3 id="rust-模块" tabindex="-1"><a class="header-anchor" href="#rust-模块"><span>Rust 模块</span></a></h3><table><thead><tr><th>模块</th><th>文件</th><th>功能</th></tr></thead><tbody><tr><td>核心命令</td><td><code>lib.rs</code></td><td>系统目录、设置管理、图片保存、笔画压缩、Office 转换、文件关联、更新检查、文档扫描</td></tr><tr><td>图像处理</td><td><code>image_processing.rs</code></td><td>base64 编解码、图像旋转</td></tr></tbody></table><h3 id="关键技术依赖" tabindex="-1"><a class="header-anchor" href="#关键技术依赖"><span>关键技术依赖</span></a></h3><ul><li><strong>image</strong> / <strong>imageproc</strong>: 图像处理</li><li><strong>serde</strong> / <strong>serde_json</strong>: 序列化</li><li><strong>ort</strong>: ONNX Runtime 绑定（AI 推理）</li><li><strong>reqwest</strong>: HTTP 客户端（更新下载、模型下载）</li><li><strong>tokio</strong>: 异步运行时</li><li><strong>chrono</strong>: 日期时间</li><li><strong>rayon</strong>: 数据并行（未直接使用，通过 image 库间接使用）</li></ul><h2 id="源-id-管理系统" tabindex="-1"><a class="header-anchor" href="#源-id-管理系统"><span>源 ID 管理系统</span></a></h2><p>ViewStage 支持多种信号源（摄像头、图片、PDF 文档），通过源 ID 系统统一管理每个源的缩放状态和批注数据：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">源类型:</span>
<span class="line">- &#39;cam&#39;         → 摄像头（唯一）</span>
<span class="line">- &#39;pic-{n}&#39;     → 图片</span>
<span class="line">- &#39;doc-{n}-{m}&#39; → PDF 文档（n=文档编号, m=页码）</span>
<span class="line"></span>
<span class="line">每个源独立保存:</span>
<span class="line">- scale（缩放比例）</span>
<span class="line">- canvasX / canvasY（画布偏移）</span>
<span class="line">- strokeHistory（批注历史）</span>
<span class="line">- baseImageURL（基础图片）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17)])])}const c=n(l,[["render",t]]),p=JSON.parse('{"path":"/architecture.html","title":"项目架构","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"整体架构","slug":"整体架构","link":"#整体架构","children":[]},{"level":2,"title":"前端架构","slug":"前端架构","link":"#前端架构","children":[{"level":3,"title":"核心文件说明","slug":"核心文件说明","link":"#核心文件说明","children":[]},{"level":3,"title":"数据流","slug":"数据流","link":"#数据流","children":[]}]},{"level":2,"title":"后端架构","slug":"后端架构","link":"#后端架构","children":[{"level":3,"title":"Rust 模块","slug":"rust-模块","link":"#rust-模块","children":[]},{"level":3,"title":"关键技术依赖","slug":"关键技术依赖","link":"#关键技术依赖","children":[]}]},{"level":2,"title":"源 ID 管理系统","slug":"源-id-管理系统","link":"#源-id-管理系统","children":[]}],"git":{"createdTime":1779008906000,"updatedTime":1779008906000,"contributors":[{"name":"ospneam","email":"2140857671@qq.com","commits":1}]},"filePathRelative":"architecture.md"}');export{c as comp,p as data};
