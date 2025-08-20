import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import { createHotUpdateHandler } from './vite-utils'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/server.ts',
      handleHotUpdate: createHotUpdateHandler(['src/builder.ts']),
    })
  ]
})
