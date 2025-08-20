import { describe, it, expect } from 'vitest'
import builder from '../../builder'

import './users'

const app = builder.build()

describe('GET /api/users', () => {
  it('should return all users', async () => {
    const res = await app.request('/api/users')

    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toHaveLength(3)
    expect(data).toEqual([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ])
  })

  it('should return JSON content type', async () => {
    const res = await app.request('/api/users')

    expect(res.headers.get('content-type')).toContain('application/json')
  })
})

describe('GET /api/users/:id', () => {
  it('should return specific user by id', async () => {
    const res = await app.request('/api/users/1')

    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com'
    })
  })

  it('should return different users for different ids', async () => {
    const res2 = await app.request('/api/users/2')
    expect(res2.status).toBe(200)

    const data2 = await res2.json()
    expect(data2).toEqual({
      id: 2,
      name: 'Bob',
      email: 'bob@example.com'
    })
  })

  it('should return 404 for non-existent user', async () => {
    const res = await app.request('/api/users/999')

    expect(res.status).toBe(404)

    const data = await res.json()
    expect(data).toEqual({
      error: 'User not found'
    })
  })
})
