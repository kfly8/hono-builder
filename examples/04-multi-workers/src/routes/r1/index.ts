import { builder } from '@/builder'

builder.get('/r1', (c) => {
  return c.json({
    group: 'r1',
    name: 'Route Group 1',
    description: 'Basic routing group for lightweight operations',
    endpoints: [
      '/r1',
      '/r1/health',
      '/r1/users',
      '/r1/users/:id'
    ]
  })
})
