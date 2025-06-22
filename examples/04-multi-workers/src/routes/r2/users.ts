import { builder } from '@/builder'

const users = [
  { id: 1, name: 'David', email: 'david@example.com', group: 'r2' },
  { id: 2, name: 'Eve', email: 'eve@example.com', group: 'r2' },
  { id: 3, name: 'Frank', email: 'frank@example.com', group: 'r2' }
]

builder.get('/r2/users', (c) => {
  return c.json({
    group: 'r2',
    users
  })
})

builder.get('/r2/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r2',
    user
  })
})
