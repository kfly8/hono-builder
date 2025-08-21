import builder from '../builder'

builder.setNotFoundHandler((c) => {
  return c.text('Not Found', 404)
})
