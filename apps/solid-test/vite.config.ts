import {defineConfig} from 'vite'
import icons from 'unplugin-icons/vite'
import markdown from 'vite-plugin-md'
import {VitePWA as vitePWA} from 'vite-plugin-pwa'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'
import vitePluginImp from 'vite-plugin-imp'
import * as dotenv from 'dotenv'
import autoImport from 'unplugin-auto-import/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './resource/manifest.json'
import solid from 'vite-plugin-solid'

// eslint-disable-next-line import/no-named-as-default-member
dotenv.config()

const appName = 'vue web app'
const shortName = 'vue app'

// eslint-disable-next-line max-lines-per-function
export default defineConfig(() => {
  return {
    build: {
      chunkSizeWarningLimit: 600,
      outDir: 'dist/spa',
    },
    define: {
      __DEV__: JSON.stringify('import.meta.env.DEV'),
      'process.env.NODE_ENV': JSON.stringify('import.meta.env.MODE'),
    },
    optimizeDeps: {
      exclude: ['vite'],
      include: [],
    },

    plugins: [
      solid(),
      autoImport({
        imports: ['solid-js'],
      }),
      tsconfigPaths(),
      vitePluginImp(),
      // https://github.com/antfu/vite-plugin-md
      markdown({
        headEnabled: true,
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Prism)
          md.use(LinkAttributes, {
            attrs: {
              rel: 'noopener',
              target: '_blank',
            },
            pattern: /^https?:\/\//u,
          })
        },
        wrapperClasses: 'q-page q-mx-auto padding',
      }),

      icons(),
      // https://github.com/antfu/vite-plugin-pwa
      vitePWA({
        includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
        manifest: {
          ...manifest,
          name: appName,
          // eslint-disable-next-line camelcase
          short_name: shortName,
          // eslint-disable-next-line camelcase
          theme_color: '#ffffff',
        },
        registerType: 'autoUpdate',
      }),
    ],

    resolve: {
      alias: {},
    },

    server: {
      // https: true,
      fs: {
        // allow: ['..', '../..'],
      },

      proxy: {
        // '/server': {
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/server/u, ''),
        //   target: process.env.API_URL,
        // },
        // '/static': {
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/static/u, ''),
        //   target: 'http://localhost:3000',
        // },
      },
    },
  }
})
