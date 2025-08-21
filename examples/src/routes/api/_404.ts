import builder from '../../builder'

builder.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

