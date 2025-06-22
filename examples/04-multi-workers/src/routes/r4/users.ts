import { builder } from '@/builder'

const users = [
  { id: 1, name: 'Jack', email: 'jack@example.com', group: 'r4' },
  { id: 2, name: 'Kelly', email: 'kelly@example.com', group: 'r4' },
  { id: 3, name: 'Leo', email: 'leo@example.com', group: 'r4' }
]

builder.get('/r4/users', (c) => {
  return c.json({
    group: 'r4',
    users
  })
})

builder.get('/r4/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({
    group: 'r4',
    user
  })
})
