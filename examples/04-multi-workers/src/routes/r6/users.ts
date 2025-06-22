import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Paul', email: 'paul@example.com', group: 'r6' },
  { id: 2, name: 'Quinn', email: 'quinn@example.com', group: 'r6' },
  { id: 3, name: 'Ruby', email: 'ruby@example.com', group: 'r6' }
]

builder.get('/r6/users', (c) => {
  return c.json({
    group: 'r6',
    users
  })
})

builder.get('/r6/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r6',
    user
  })
})
