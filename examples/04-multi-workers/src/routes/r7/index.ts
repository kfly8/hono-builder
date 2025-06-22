import { builder } from '@/builder'

builder.get('/r7', (c) => {
  return c.json({
    group: 'r7',
    name: 'Route Group 7',
    description: 'Routing group 7 for distributed operations',
    endpoints: [
      '/r7',
      '/r7/health',
      '/r7/users',
      '/r7/users/:id'
    ]
  })
})
