import { describe, it, expect } from 'vitest'
import builder from '../builder'

import './root'
const app = builder.build()

describe('GET /', () => {

  it('should return 200 status', async () => {
    const res = await app.request('/')

    expect(res.status).toBe(200)
  })

  it('should return HTML content', async () => {
    const res = await app.request('/')

    expect(res.headers.get('content-type')).toContain('text/html')
  })

  it('should contain main heading', async () => {
    const res = await app.request('/')
    const html = await res.text()

    expect(html).toContain('Hono Builder Examples')
  })
})
