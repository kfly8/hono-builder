import { builder } from '../builder'

builder.get('hello', (c) => {
  const message = c.get('message')

  return c.json({
    message: message
  })
})
