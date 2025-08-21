import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/server.ts',
      handleHotUpdate: ({ server, modules }) => {
        const isSSR = modules.some((mod) => (mod as any)._ssrModule)

        if (isSSR) {
          const modulesToReload = ['src/builder.ts']

          for (const modulePath of modulesToReload) {
            const absolutePath = path.join(__dirname, modulePath)
            const module = server.moduleGraph.getModuleById(absolutePath)

            if (module) {
              server.reloadModule(module)
            }
            else {
              console.log(`Module not found for hot reload: ${absolutePath}`)
            }
          }

          server.hot.send({ type: 'full-reload' })
          return []
        }
      },
    })
  ]
})
