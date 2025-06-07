import { builder } from '../builder'

const route = builder
  .get('/api/hello', (c) => {
    return c.json({ message: 'Hello, world!' })
  })
  .get('/api/hello/:name', (c) => {
    const name = c.req.param('name')
    return c.json({ message: `Hello, ${name}!` })
  })

export type ApiType = typeof route
