import { builder } from '@/builder'

builder.get('/r6', (c) => {
  return c.json({
    group: 'r6',
    name: 'Route Group 6',
    description: 'Routing group 6 for distributed operations',
    endpoints: [
      '/r6',
      '/r6/health',
      '/r6/users',
      '/r6/users/:id'
    ]
  })
})
