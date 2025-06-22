import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Maya', email: 'maya@example.com', group: 'r5' },
  { id: 2, name: 'Noah', email: 'noah@example.com', group: 'r5' },
  { id: 3, name: 'Olivia', email: 'olivia@example.com', group: 'r5' }
]

builder.get('/r5/users', (c) => {
  return c.json({
    group: 'r5',
    users
  })
})

builder.get('/r5/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r5',
    user
  })
})
