import{_ as n,a,b as e,o as i}from"./app-C8pZrsNM.js";const l={};function c(t,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="环境搭建" tabindex="-1"><a class="header-anchor" href="#环境搭建"><span>环境搭建</span></a></h1><h2 id="系统要求" tabindex="-1"><a class="header-anchor" href="#系统要求"><span>系统要求</span></a></h2><ul><li><strong>Node.js</strong>: 推荐 20.x 或更高版本</li><li><strong>Rust</strong>: 稳定版（推荐使用 rustup 安装）</li><li><strong>Tauri CLI</strong>: 2.0 版本</li></ul><h2 id="安装步骤" tabindex="-1"><a class="header-anchor" href="#安装步骤"><span>安装步骤</span></a></h2><h3 id="_1-安装-rust" tabindex="-1"><a class="header-anchor" href="#_1-安装-rust"><span>1. 安装 Rust</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># 访问 https://rustup.rs/ 或执行：</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">--proto</span> <span class="token string">&#39;=https&#39;</span> <span class="token parameter variable">--tlsv1.2</span> <span class="token parameter variable">-sSf</span> https://sh.rustup.rs <span class="token operator">|</span> <span class="token function">sh</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-安装-tauri-cli" tabindex="-1"><a class="header-anchor" href="#_2-安装-tauri-cli"><span>2. 安装 Tauri CLI</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">cargo</span> <span class="token function">install</span> tauri-cli <span class="token parameter variable">--version</span> <span class="token string">&quot;^2.0&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_3-克隆项目" tabindex="-1"><a class="header-anchor" href="#_3-克隆项目"><span>3. 克隆项目</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">git</span> clone https://github.com/ospneam/ViewStage.git</span>
<span class="line"><span class="token builtin class-name">cd</span> ViewStage</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="运行项目" tabindex="-1"><a class="header-anchor" href="#运行项目"><span>运行项目</span></a></h2><h3 id="开发模式" tabindex="-1"><a class="header-anchor" href="#开发模式"><span>开发模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">cargo</span> tauri dev</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="构建发布" tabindex="-1"><a class="header-anchor" href="#构建发布"><span>构建发布</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">cargo</span> tauri build</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构"><span>项目结构</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">ViewStage/</span>
<span class="line">├── src/                    # 前端源码</span>
<span class="line">│   ├── index.html          # 主界面 HTML</span>
<span class="line">│   ├── main.js             # 核心逻辑</span>
<span class="line">│   ├── init.js             # 初始化</span>
<span class="line">│   ├── history.js          # 撤销系统</span>
<span class="line">│   ├── batch-draw.js       # 批量绘制</span>
<span class="line">│   ├── i18n.js             # 国际化</span>
<span class="line">│   ├── pen_tessellator.js  # 笔锋算法</span>
<span class="line">│   ├── styles.css          # 主样式</span>
<span class="line">│   ├── canvas.css          # 画布样式</span>
<span class="line">│   ├── settings.html/css/js # 设置页面</span>
<span class="line">│   ├── oobe.html/css/js    # 首次启动引导</span>
<span class="line">│   ├── splashscreen.html   # 启动屏</span>
<span class="line">│   ├── JS/                 # 第三方 JS 库</span>
<span class="line">│   │   ├── pdf.js          # PDF.js</span>
<span class="line">│   │   ├── canvas.js       # html2canvas</span>
<span class="line">│   │   └── mammoth.browser.min.js</span>
<span class="line">│   ├── locales/            # 国际化语言文件</span>
<span class="line">│   │   ├── zh-CN.json</span>
<span class="line">│   │   ├── zh-TW.json</span>
<span class="line">│   │   └── en-US.json</span>
<span class="line">│   ├── themes/             # 主题系统</span>
<span class="line">│   │   ├── theme.js        # 主题管理器</span>
<span class="line">│   │   ├── simplify/       # 简化主题</span>
<span class="line">│   │   └── dark/           # 深色主题</span>
<span class="line">│   ├── doc-scan/           # 文档扫描</span>
<span class="line">│   └── assets/             # 静态资源</span>
<span class="line">├── src-tauri/              # Rust 后端</span>
<span class="line">│   ├── src/</span>
<span class="line">│   │   ├── main.rs         # 入口</span>
<span class="line">│   │   ├── lib.rs          # 核心逻辑</span>
<span class="line">│   │   └── image_processing.rs</span>
<span class="line">│   ├── Cargo.toml          # Rust 依赖</span>
<span class="line">│   ├── tauri.conf.json     # Tauri 配置</span>
<span class="line">│   └── icons/              # 应用图标</span>
<span class="line">├── model/                  # 模型文件</span>
<span class="line">└── README.md</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># 运行开发服务器</span></span>
<span class="line"><span class="token function">cargo</span> tauri dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 构建生产版本</span></span>
<span class="line"><span class="token function">cargo</span> tauri build</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 运行 Rust 测试</span></span>
<span class="line"><span class="token function">cargo</span> <span class="token builtin class-name">test</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 运行 clippy 检查</span></span>
<span class="line"><span class="token function">cargo</span> clippy</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19)])])}const d=n(l,[["render",c]]),p=JSON.parse('{"path":"/development/setup.html","title":"环境搭建","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"系统要求","slug":"系统要求","link":"#系统要求","children":[]},{"level":2,"title":"安装步骤","slug":"安装步骤","link":"#安装步骤","children":[{"level":3,"title":"1. 安装 Rust","slug":"_1-安装-rust","link":"#_1-安装-rust","children":[]},{"level":3,"title":"2. 安装 Tauri CLI","slug":"_2-安装-tauri-cli","link":"#_2-安装-tauri-cli","children":[]},{"level":3,"title":"3. 克隆项目","slug":"_3-克隆项目","link":"#_3-克隆项目","children":[]}]},{"level":2,"title":"运行项目","slug":"运行项目","link":"#运行项目","children":[{"level":3,"title":"开发模式","slug":"开发模式","link":"#开发模式","children":[]},{"level":3,"title":"构建发布","slug":"构建发布","link":"#构建发布","children":[]}]},{"level":2,"title":"项目结构","slug":"项目结构","link":"#项目结构","children":[]},{"level":2,"title":"常用命令","slug":"常用命令","link":"#常用命令","children":[]}],"git":{"createdTime":1779008906000,"updatedTime":1779008906000,"contributors":[{"name":"ospneam","email":"2140857671@qq.com","commits":1}]},"filePathRelative":"development/setup.md"}');export{d as comp,p as data};
