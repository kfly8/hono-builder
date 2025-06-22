import { builder } from '@/builder'

builder.get('/r3', (c) => {
  return c.json({
    group: 'r3',
    name: 'Route Group 3',
    description: 'Advanced operations routing group',
    endpoints: [
      '/r3',
      '/r3/health',
      '/r3/users',
      '/r3/users/:id'
    ]
  })
})
