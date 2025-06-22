import { builder } from '@/builder'

builder.get('/r4', (c) => {
  return c.json({
    group: 'r4',
    name: 'Route Group 4',
    description: 'Routing group 4 for distributed operations',
    endpoints: [
      '/r4',
      '/r4/health',
      '/r4/users',
      '/r4/users/:id'
    ]
  })
})
