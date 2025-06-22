import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Yara', email: 'yara@example.com', group: 'r9' },
  { id: 2, name: 'Zoe', email: 'zoe@example.com', group: 'r9' },
  { id: 3, name: 'Alex', email: 'alex@example.com', group: 'r9' }
]

builder.get('/r9/users', (c) => {
  return c.json({
    group: 'r9',
    users
  })
})

builder.get('/r9/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r9',
    user
  })
})
