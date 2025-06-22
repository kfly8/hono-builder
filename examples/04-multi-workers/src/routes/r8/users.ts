import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Victor', email: 'victor@example.com', group: 'r8' },
  { id: 2, name: 'Wendy', email: 'wendy@example.com', group: 'r8' },
  { id: 3, name: 'Xavier', email: 'xavier@example.com', group: 'r8' }
]

builder.get('/r8/users', (c) => {
  return c.json({
    group: 'r8',
    users
  })
})

builder.get('/r8/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r8',
    user
  })
})
