import { describe, it, expect } from 'vitest'
import builder from '../builder'

import './todos'

const app = builder.build()

describe('GET /todos', () => {
  it('should return 200 status', async () => {
    const res = await app.request('/todos')

    expect(res.status).toBe(200)
  })

  it('should return HTML content', async () => {
    const res = await app.request('/todos')

    expect(res.headers.get('content-type')).toContain('text/html')
  })

  it('should contain page title', async () => {
    const res = await app.request('/todos')
    const html = await res.text()

    expect(html).toContain('Todo List')
  })

  it('should contain todo form', async () => {
    const res = await app.request('/todos')
    const html = await res.text()

    expect(html).toContain('<form action="/todos" method="post"')
    expect(html).toContain('placeholder="Enter a new todo..."')
    expect(html).toContain('Add Todo')
  })

  it('should display initial todos', async () => {
    const res = await app.request('/todos')
    const html = await res.text()

    expect(html).toContain('Learn Hono')
    expect(html).toContain('Build an app')
    expect(html).toContain('Deploy to production')
  })

  it('should contain navigation link', async () => {
    const res = await app.request('/todos')
    const html = await res.text()

    expect(html).toContain('href="/"')
    expect(html).toContain('Back to Home')
  })
})

describe('POST /todos', () => {
  it('should add new todo and redirect', async () => {
    const formData = new FormData()
    formData.append('title', 'Test new todo')

    const res = await app.request('/todos', {
      method: 'POST',
      body: formData
    })

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/todos')
  })

  it('should handle empty title', async () => {
    const formData = new FormData()
    formData.append('title', '')

    const res = await app.request('/todos', {
      method: 'POST',
      body: formData
    })

    expect(res.status).toBe(302)
  })
})

describe('POST /todos/:id/toggle', () => {
  it('should toggle todo completion and redirect', async () => {
    const res = await app.request('/todos/1/toggle', {
      method: 'POST'
    })

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/todos')
  })

  it('should handle non-existent todo id', async () => {
    const res = await app.request('/todos/999/toggle', {
      method: 'POST'
    })

    expect(res.status).toBe(302)
  })
})
