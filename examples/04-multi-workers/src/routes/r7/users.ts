import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Sam', email: 'sam@example.com', group: 'r7' },
  { id: 2, name: 'Tara', email: 'tara@example.com', group: 'r7' },
  { id: 3, name: 'Uma', email: 'uma@example.com', group: 'r7' }
]

builder.get('/r7/users', (c) => {
  return c.json({
    group: 'r7',
    users
  })
})

builder.get('/r7/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r7',
    user
  })
})
