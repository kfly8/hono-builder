import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', group: 'r1' },
  { id: 2, name: 'Bob', email: 'bob@example.com', group: 'r1' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', group: 'r1' }
]

builder.get('/r1/users', (c) => {
  return c.json({
    group: 'r1',
    users
  })
})

builder.get('/r1/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r1',
    user
  })
})
