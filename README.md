![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/kfly8/hono-builder/ci.yml)
![GitHub License](https://img.shields.io/github/license/kfly8/hono-builder)
[![NPM Version](https://img.shields.io/npm/v/hono-builder)](https://www.npmjs.com/package/hono-builder)
[![JSR](https://jsr.io/badges/@kfly8/hono-builder)](https://jsr.io/@kfly8/hono-builder)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/hono-builder)](https://bundlephobia.com/package/hono-builder)
[![npm bundle size](https://img.shields.io/bundlephobia/min/hono-builder)](https://bundlephobia.com/package/hono-builder)


# ⚠️ DEPRECATED - Hono Builder

> **This package is deprecated.** Hono framework alone is sufficient for achieving the same goals. See the [migration guide](#migration-from-hono-builder) below.

~~A modular routing system for [Hono](https://hono.dev) that enables file-based routing with optimized bundle sizes for edge runtimes.~~

## Migration from hono-builder

You don't need hono-builder! Hono itself supports everything you need:

### Before (with hono-builder):
```typescript
// builder.ts
import { honoBuilder } from 'hono-builder'
const builder = honoBuilder()
export default builder
```

### After (Hono only):
```typescript
// builder.ts
import { Hono } from 'hono'
const builder = new Hono()
export default builder
```

### File-based routing works the same way:
```typescript
// routes/users.ts
import builder from '../builder'
builder.get('/users', handler)
```

### Multi-endpoint configuration:
```typescript
// web-server.ts - imports web routes
import './routes/web/*'
import app from './builder'
export default app

// api-server.ts - imports only API routes
import './routes/api/*'
import app from './builder'
export default app
```

---

## Original Documentation (Deprecated)

## Installation

```bash
npm install hono-builder # ⚠️ DEPRECATED - use 'hono' instead
```

## Usage

The following are a typical project structure using HonoBuilder.

**Project structure:**
```
src/
├── builder.ts       // Setup HonoBuilder
├── server.ts        // Import routes and build app
├── renderer.tsx
├── routes/          // Define routes as separate files
│   ├── _404.tsx
│   ├── _error.tsx
│   ├── root.tsx
│   ├── todos.tsx
│   └── api
│       ├── status.ts
│       └── users.ts
└── ...
```

**src/builder.ts** - Creates and configures the HonoBuilder instance with middleware:
```typescript
import { honoBuilder } from 'hono-builder'
import { logger } from 'hono/logger'
import { renderer } from './renderer'

const builder = honoBuilder()
builder.use(logger())
builder.use(renderer)

export default builder
```

**src/server.ts** - Imports all routes and builds the final Hono app:
```typescript
// Import necessary routes
import './routes/_404'
import './routes/_error'
import.meta.glob('./routes/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

import builder from './builder'

const app = builder.build()

export default app
```

**src/routes/root.ts:**
```typescript
import builder from '../builder'

builder.get('/', (c) => {
  return c.render(<h1>Hello World</h1>)
})
```

For more details, please refer to the examples.
[https://github.com/kfly8/hono-builder/tree/main/examples](https://github.com/kfly8/hono-builder/tree/main/examples)

## Methods

`HonoBuilder` has the following methods.

- builder.**build**()
- builder.**setNotFoundHandler**(handler)
- builder.**setErrorHandler**(handler)

Additionally, `HonoBuilder` has the routing methods, which have the same interface as `Hono`.

- builder.**HTTP_METHOD**([path,]handler|middleware...)
- builder.**all**([path,]handler|middleware...)
- builder.**on**(method|method[], path|path[], handler|middleware...)
- builder.**use**([path,]middleware)
- builder.**route**(path, [app])
- builder.**basePath**(path)
- builder.**mount**(path, anotherApp)

## `honoBuilder`

`honoBuilder` receives options and type generics like `Hono`, and generates a `Hono` instance based on them.

```typescript
type Bindings = {
  HELLO: string
}

type Env = {
  Bindings: Bindings
}

const options = {
  strict: true
}

const builder = honoBuilder<Env>(options)

const app = builder.build()
// => build Hono<Env>(options)
```

## `build()`

`.build()` makes a new Hono instance with the configured routes.

```typescript
const builder = honoBuilder()

// Define routes
builder.get('/hello', (c) => c.json({ message: 'Hello!' }))

// Build the Hono app
const app = builder.build()
```

## `setNotFoundHandler`

`.setNotFoundHandler()` allows you to customize a Not Found Response.
 
```typescript
builder.setNotFoundHandler((c) => {
  return c.text('Custom 404 Message', 404)
})
```

## `setErrorHandler`

`.setErrorHandler()` handles an error and returns a customized Response.

```typescript
builder.setErrorHandler((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

## Notes

### Hot Module Replacement (HMR) with Vite

When using Vite dev server with HonoBuilder, you need to configure `handleHotUpdate` to properly reload the builder module when routes change. This ensures that new routes are registered during development.

The `handleHotUpdate` function in `vite.config.ts` should reload `src/builder.ts` when any SSR module changes:

```typescript
handleHotUpdate: ({ server, modules }) => {
  const isSSR = modules.some((mod) => (mod as any)._ssrModule)
  if (isSSR) {
    const builderModule = server.moduleGraph.getModuleById(
      new URL('./src/builder.ts', import.meta.url).pathname
    )
    if (builderModule) {
      server.reloadModule(builderModule)
    }
    server.hot.send({ type: 'full-reload' })
    return []
  }
}
```

This is necessary because HonoBuilder routes are registered at import time, and without reloading the builder module, changes to route files won't be reflected in the running server.


## How it works

HonoBuilder uses JavaScript Proxy and TypeScript's `as` type assertions to provide a builder pattern while maintaining full Hono compatibility. Under the hood, it's still Hono, but wrapped with HonoBuilder's interface for modular route registration.

```typescript
export function honoBuilder<E, S, BasePath>(options?: HonoOptions<E>): HonoBuilder<E, S, BasePath> {
  // Create a standard Hono instance but cast it as HonoBuilder
  const builder = new Hono<E, S, BasePath>(options) as HonoBuilder<E, S, BasePath>

  const createProxy = (target: typeof builder): typeof builder => {
    return new Proxy(target, {
      get(target, prop, receiver) {
        // Add the build() method that returns the Hono instance
        if (prop === 'build') {
          return () => target as Hono<E, S, BasePath>
        }

        ...

        return Reflect.get(target, prop, receiver)
      },
    })
  }

  return createProxy(builder)
}
```

This architecture ensures that you retain all of Hono's type safety and features while gaining the benefits of modular routing and optimized bundling.

## Acknowledgments

This project is built with and inspired by [Hono](https://hono.dev).
Special thanks to [Yusuke Wada](https://github.com/yusukebe) and the Hono contributors for creating such an amazing framework.

