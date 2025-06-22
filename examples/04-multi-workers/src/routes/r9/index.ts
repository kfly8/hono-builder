import { builder } from '@/builder'

builder.get('/r9', (c) => {
  return c.json({
    group: 'r9',
    name: 'Route Group 9',
    description: 'Routing group 9 for distributed operations',
    endpoints: [
      '/r9',
      '/r9/health',
      '/r9/users',
      '/r9/users/:id'
    ]
  })
})
