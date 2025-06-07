import { builder } from '../builder'

builder.get('/', (c) => {
  return c.json({
    message: 'Hello, world!',
  })
})
