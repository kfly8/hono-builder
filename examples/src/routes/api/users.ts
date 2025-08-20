import b from '../../builder'

const builder = b.basePath('/api/users')

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
]

const route = builder
  .get('/', (c) => {
    return c.json(users)
  })
  .get('/:id', (c) => {
    const id = c.req.param('id')
    const user = users.find(u => u.id === parseInt(id))
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json(user)
  })

export type ApiType = typeof route
