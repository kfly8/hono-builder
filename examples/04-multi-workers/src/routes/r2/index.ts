import { builder } from '@/builder'

builder.get('/r2', (c) => {
  return c.json({
    group: 'r2',
    name: 'Route Group 2',
    description: 'Data processing routing group',
    endpoints: [
      '/r2',
      '/r2/health',
      '/r2/users',
      '/r2/users/:id'
    ]
  })
})
