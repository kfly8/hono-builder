import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Grace', email: 'grace@example.com', group: 'r3' },
  { id: 2, name: 'Henry', email: 'henry@example.com', group: 'r3' },
  { id: 3, name: 'Ivy', email: 'ivy@example.com', group: 'r3' }
]

builder.get('/r3/users', (c) => {
  return c.json({
    group: 'r3',
    users
  })
})

builder.get('/r3/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r3',
    user
  })
})
