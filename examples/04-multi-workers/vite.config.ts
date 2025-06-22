import path from "path"
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

// エントリーポイントの設定
const entries = {
  dev: {
    input: './src/entrypoint/dev.ts',
    outDir: 'dist/dev'
  },
  entry1: {
    input: './src/entrypoint/entry1.ts',
    outDir: 'dist/entry1'
  },
  entry2: {
    input: './src/entrypoint/entry2.ts',
    outDir: 'dist/entry2'
  },
  entry3: {
    input: './src/entrypoint/entry3.ts',
    outDir: 'dist/entry3'
  }
}

export default defineConfig(({ mode }) => {
  // モードからターゲットを決定
  const target = mode || 'dev'
  const entry = entries[target as keyof typeof entries] || entries.dev

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: entry.outDir,
      rollupOptions: {
        input: entry.input,
        output: {
          entryFileNames: 'index.js',
          chunkFileNames: '[name]-[hash].js'
        }
      }
    },
    plugins: [
      cloudflare(),
      ssrPlugin()
    ]
  }
})
