import { recoTheme } from 'vuepress-theme-reco'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'zh-CN',

  title: 'ViewStage',
  description: '基于 Tauri 构建的摄像头及 PDF 展台应用，提供简洁高效的课堂及其他用途的全屏展台',

  shouldPrefetch: false,

  plugins: [
    {
      name: 'suppress-vue-ssr-debug',
      clientAppEnhance: ({ app, isServer }) => {
        if (isServer) {
          app.config.warnHandler = () => {};
          app.config.errorHandler = () => {};
        }
      },
    },
  ],

  theme: recoTheme({
    logo: '/images/logo.png',

    colorMode: 'auto',
    colorModeSwitch: true,

    navbar: [
      { text: '首页', link: '/' },
      { text: '快速入门', link: '/get-started' },
      { text: '功能特性', link: '/features/' },
      { text: '开发指南', link: '/development/' },
      { text: '使用指南', link: '/guide/' },
      { text: '项目架构', link: '/architecture' },
    ],

    series: {
      '/': [
        {
          text: 'ViewStage',
          children: [
            '/README.md',
            '/get-started.md',
            '/architecture.md',
          ],
        },
        {
          text: '功能特性',
          children: [
            '/features/index.md',
            '/features/camera.md',
            '/features/pdf-document.md',
            '/features/annotation.md',
            '/features/pen-tools.md',
            '/features/doc-scan.md',
            '/features/file-management.md',
          ],
        },
        {
          text: '开发指南',
          children: [
            '/development/index.md',
            '/development/setup.md',
            '/development/frontend.md',
            '/development/backend.md',
            '/development/modules.md',
            '/development/events.md',
            '/development/error-handling.md',
          ],
        },
        {
          text: '使用指南',
          children: [
            '/guide/index.md',
            '/guide/settings.md',
            '/guide/theme.md',
            '/guide/i18n.md',
            '/guide/keyboard-shortcuts.md',
            '/guide/splash-screen.md',
            '/guide/theme-design.md',
          ],
        },
      ],
    },

    autoSetBlogCategories: false,
    autoAddCategoryToNavbar: false,
    author: 'ospneam',
  }),

  bundler: viteBundler({
    viteOptions: {
      build: {
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      },
    },
    vuePluginOptions: {},
  }),
})
