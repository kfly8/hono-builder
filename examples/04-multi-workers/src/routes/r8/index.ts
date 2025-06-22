import { builder } from '@/builder'

builder.get('/r8', (c) => {
  return c.json({
    group: 'r8',
    name: 'Route Group 8',
    description: 'Routing group 8 for distributed operations',
    endpoints: [
      '/r8',
      '/r8/health',
      '/r8/users',
      '/r8/users/:id'
    ]
  })
})
