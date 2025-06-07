# hono-builder

Builder pattern for Hono applications.

## Usage

```typescript
import { HonoBuilder } from 'hono-builder'

const builder = new HonoBuilder()

// Define routes
builder.get('/hello', (c) => {
  return c.json({ message: 'Hello, World!' })
})

// Set handlers (optional)
builder.setErrorHandler((err, c) => {
  return c.json({ error: err.message }, 500)
})

builder.setNotFoundHandler((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Build the Hono app
const app = builder.build()

export default app
```

