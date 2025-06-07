import { builder } from '../builder'

builder.get('/', (c) => {
  const message = c.get('message')

  return c.json({
    message: message
  })
})
