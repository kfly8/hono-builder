import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

// Example of starting only api server using hono-builder
export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/api-server.ts',
    })
  ]
})
