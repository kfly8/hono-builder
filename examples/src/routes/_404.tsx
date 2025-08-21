import builder from '../builder'

builder.notFound((c) => {
  return c.text('Not Found', 404)
})
