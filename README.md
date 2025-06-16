![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/kfly8/hono-builder/ci.yml)
![GitHub License](https://img.shields.io/github/license/kfly8/hono-builder)
![NPM Version](https://img.shields.io/npm/v/hono-builder)

# Hono Builder

Builder class for Hono framework. Enables modular routing and optimized bundle sizes for edge runtimes.

## Import

```typescript
import { HonoBuilder } from 'hono-builder'
```

## Methods

An instance of `HonoBuilder` has the following methods.

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

## `build()`

`builder.build()` makes a new Hono instance with the configured routes.

```typescript
const builder = new HonoBuilder()

// Define routes
builder.get('/hello', (c) => c.json({ message: 'Hello!' }))

// Build the Hono app
const app = builder.build()
```

## `setNotFoundHandler`

`builder.setNotFoundHandler` allows you to customize a Not Found Response.
 
```typescript
builder.setNotFoundHandler((c) => {
  return c.text('Custom 404 Message', 404)
})
```

## `setErrorHandler`

`builder.setErrorHandler` handles an error and returns a customized Response.

```typescript
builder.setErrorHandler((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

## Constructor

`HonoBuilder` receives options and type generics like `Hono`, and generates a `Hono` instance based on them.

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

const builder = new HonoBuilder<Env>(options)

const app = builder.build()
// => build Hono<Env>(options)
```

## File Layout

There are several ways to structure code using `HonoBuilder` depending on the situation. Here is a recommended approach, but please note that this is completely optional.

```
src
├── builder.ts       // Setup HonoBuilder.
├── app.ts           // Import routing files and exports builder.build()
├── routes           // Define routings
│   ├── _404.tsx
│   ├── _error.tsx
│   └── root.tsx
└── server.ts        // Entrypoint of server
```

For more details, please refer to the examples.

## Acknowledgments

This project is built with and inspired by [Hono](https://hono.dev).
Special thanks to [Yusuke Wada](https://github.com/yusukebe) and the Hono contributors for creating such an amazing framework.

