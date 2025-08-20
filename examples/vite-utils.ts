import type { HmrContext, ModuleNode } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Creates a handleHotUpdate function that reloads specified modules on SSR changes
 * @param modulesToReload - Array of relative module paths to reload (e.g., ['src/builder.tsx', 'src/index.tsx'])
 * @returns handleHotUpdate function for Vite configuration
 */
export function createHotUpdateHandler(modulesToReload: string[]) {
  return ({ server, modules }: HmrContext): void | ModuleNode[] => {
    const isSSR = modules.some((mod) => (mod as any)._ssrModule)

    if (isSSR) {
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
  }
}
