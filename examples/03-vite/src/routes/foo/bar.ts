import { builder } from '../../builder'

builder.get('/foo/bar', (c) => {
  return c.json({
    message: 'foo/bar!',
  })
})
