import { describe, it, expect } from 'vitest'
import builder from '../../builder'

import './index'
const app = builder.build()

describe('GET /blog', () => {
  it('should return 200 status', async () => {
    const res = await app.request('/blog')

    expect(res.status).toBe(200)
  })

  it('should return HTML content', async () => {
    const res = await app.request('/blog')

    expect(res.headers.get('content-type')).toContain('text/html')
  })

  it('should contain blog title and description', async () => {
    const res = await app.request('/blog')
    const html = await res.text()

    expect(html).toContain('<h1>Blog</h1>')
    expect(html).toContain('Latest articles and tutorials')
  })
})
