import { HonoBuilder } from './hono-builder'

describe('build', () => {
  const builder = new HonoBuilder()

  builder.get('/hello', (c) => {
    return c.json({ message: 'Hello, World!' })
  })

  const app = builder.build()

  it('should respond to GET /hello', async () => {
    const res = await app.request('/hello')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual({ message: 'Hello, World!' })
  })
})

describe('setNotFoundHandler', () => {
  const builder = new HonoBuilder()

  builder.setNotFoundHandler((c) => {
    return c.json({ error: 'Not Found' }, 404)
  })

  const app = builder.build()

  it('should respond with 404 for unknown routes', async () => {
    const res = await app.request('/unknown')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toEqual({ error: 'Not Found' })
  })
})

describe('setErrorHandler', () => {
  const builder = new HonoBuilder()

  builder.setErrorHandler((err, c) => {
    return c.json({
      error: err.message,
    }, 500)
  })

  builder.get('/error', () => {
    throw new Error('Test Error')
  })

  const app = builder.build()

  it('should respond with 500 for errors', async () => {
    const res = await app.request('/error')
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toEqual({ error: 'Test Error' })
  })
})

