
  import { defineAsyncComponent } from 'vue'
import { defineClientConfig } from 'vuepress/client'

import { applyClientSetup } from 'D:/code/viewstage-docs/node_modules/.pnpm/vuepress-theme-reco@2.0.0-r_85a1075e2904e50b52de11298f1633dc/node_modules/vuepress-theme-reco/lib/client/clientSetup.js'
import { applyClientEnhance } from 'D:/code/viewstage-docs/node_modules/.pnpm/vuepress-theme-reco@2.0.0-r_85a1075e2904e50b52de11298f1633dc/node_modules/vuepress-theme-reco/lib/client/clientEnhance.js'

import * as layouts from 'D:/code/viewstage-docs/node_modules/.pnpm/vuepress-theme-reco@2.0.0-r_85a1075e2904e50b52de11298f1633dc/node_modules/vuepress-theme-reco/lib/client/layouts/index.js'

  const layoutsFromDir = {}
export default defineClientConfig({
  enhance(...args) {
    applyClientEnhance(...args)
  },
  setup() {
    applyClientSetup()
  },
  // @ts-ignore
  layouts: { ...layouts, ...layoutsFromDir },
})
