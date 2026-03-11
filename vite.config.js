import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { configureInputs, MoveManifestPlugin } from './vite.utils'
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import pugPlugin from 'vite-plugin-pug'

const copyOptions = {
  targets: [
    {
      src: ['./assets/images/*'],
      dest: './assets/images',
    },
    {
      src: ['./assets/icons/*'],
      dest: './assets/icons',
    },
  ],
}

const pugOptions = {
  pretty: true,
  localImports: true,
  basedir: resolve(__dirname, 'src'),
}

const pugLocals = {
  baseUrl: '.',
  viewsUrl: '/views',
  imagesUrl: '/assets/images',
  iconsUrl: '/assets/icons',

  $: {
    requireDataPage(page) {
      const context = 'src/views'
      const dirname = resolve(process.cwd(), `${context}/${page}/data.json`)

      return require(dirname)
    },
  },
}

export default defineConfig({
  root: 'src',
  plugins: [
    pugPlugin(pugOptions, pugLocals),
    ViteSvgSpriteWrapper({
      icons: './src/assets/icons/*.svg',
      outputDir: resolve(__dirname, 'src/assets/icons'),
    }),
    viteStaticCopy(copyOptions),
    /* mpa(mpaOptions) */
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      components: resolve(__dirname, 'src/components'),
      layouts: resolve(__dirname, 'src/layouts'),
      partials: resolve(__dirname, 'src/partials'),
      views: resolve(__dirname, 'src/views'),
      styles: resolve(__dirname, 'src/styles'),
      images: resolve(__dirname, 'src/assets/images'),
      icons: resolve(__dirname, 'src/assets/icons'),
      fonts: resolve(__dirname, 'src/assets/fonts'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.pug', '.scss'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    cssCodeSplit: false,
    manifest: true,
    outDir: resolve(__dirname, 'build'),
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'src/index.html'),
        ...configureInputs('src', 'views'),
      },
      plugins: [
        nodePolyfills(),
        MoveManifestPlugin('./build/assets/manifest.json'),
      ],
    },
  },
})
