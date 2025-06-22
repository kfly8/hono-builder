import { builder } from '@/builder'

builder.get('/r5', (c) => {
  return c.json({
    group: 'r5',
    name: 'Route Group 5',
    description: 'Routing group 5 for distributed operations',
    endpoints: [
      '/r5',
      '/r5/health',
      '/r5/users',
      '/r5/users/:id'
    ]
  })
})
