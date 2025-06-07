import { builder } from '../builder'

builder.setNotFoundHandler((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

