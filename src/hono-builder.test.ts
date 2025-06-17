import { newHonoBuilder } from './hono-builder'

describe('#build', () => {
  const builder = newHonoBuilder()

  builder.get('/hello', (c) => {
    return c.json({ message: 'Hello, World!' })
  })

  const app = builder.build()

  it('GET /hello is ok', async () => {
    const res = await app.request('/hello')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual({ message: 'Hello, World!' })
  })

  suite('Variables', () => {
    type Variables = {
      startTime: number
    }
    const builder = newHonoBuilder<{ Variables: Variables }>()

    builder.use('/api/*', async (c, next) => {
      c.set('startTime', Date.now())
      await next()
      const endTime = Date.now()
      const duration = endTime - c.get('startTime')
      c.header('X-Duration', duration.toString())
    })

    builder.get('/api/test', (c) => {
      const startTime = c.get('startTime')
      return c.json({ message: 'Test', startTime })
    })

    const app = builder.build()

    it('should handle context variables', async () => {
      const res = await app.request('/api/test')
      expect(res.status).toBe(200)
      expect(res.headers.get('X-Duration')).toBeTruthy()

      const body = (await res.json()) as { message: string; startTime: number }
      expect(body.message).toBe('Test')
      expect(typeof body.startTime).toBe('number')
    })
  })

  suite('Bindings', () => {
    type Bindings = {
      API_KEY: string
      DB_URL: string
    }

    const builder = newHonoBuilder<{ Bindings: Bindings }>()

    builder.get('/api/config', (c) => {
      const apiKey = c.env.API_KEY
      const dbUrl = c.env.DB_URL
      return c.json({ apiKey, dbUrl })
    })

    const app = builder.build()

    it('should handle context bindings', async () => {
      const mockEnv = { API_KEY: 'my-secret-key', DB_URL: 'postgresql://localhost:5432/mydb' }

      const res = await app.request('/api/config', {}, mockEnv)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body).toEqual({
        apiKey: 'my-secret-key',
        dbUrl: 'postgresql://localhost:5432/mydb',
      })
    })
  })
})

describe('#setNotFoundHandler', () => {
  it('should set custom 404 handler', async () => {
    const builder = newHonoBuilder()

    builder.setNotFoundHandler((c) => {
      return c.text('Custom 404 Message', 404)
    })

    const app = builder.build()
    const res = await app.request('/nonexistent')

    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Custom 404 Message')
  })
})

describe('#setErrorHandler', () => {
  it('should set custom error handler', async () => {
    const builder = newHonoBuilder()

    builder.setErrorHandler((err, c) => {
      console.error(`Error: ${err.message}`)
      return c.text('Custom Error Message', 500)
    })

    builder.get('/error', () => {
      throw new Error('Test error')
    })

    const app = builder.build()
    const res = await app.request('/error')

    expect(res.status).toBe(500)
    expect(await res.text()).toBe('Custom Error Message')
  })
})
describe('#HTTP_METHOD', () => {
  const builder = newHonoBuilder()

  builder.get('/foo', (c) => c.text('GET method'))
  builder.post('/foo', (c) => c.text('POST method'))
  builder.put('/foo', (c) => c.text('PUT method'))
  builder.delete('/foo', (c) => c.text('DELETE method'))
  builder.patch('/foo', (c) => c.text('PATCH method'))
  builder.options('/foo', (c) => c.text('OPTIONS method'))

  const app = builder.build()

  it('GET /foo is ok', async () => {
    const res = await app.request('/foo')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('GET method')
  })

  it('POST /foo is ok', async () => {
    const res = await app.request('/foo', { method: 'POST' })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('POST method')
  })

  it('PUT /foo', async () => {
    const res = await app.request('/foo', { method: 'PUT' })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('PUT method')
  })

  it('DELETE /foo', async () => {
    const res = await app.request('/foo', { method: 'DELETE' })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('DELETE method')
  })

  it('PATCH /foo', async () => {
    const res = await app.request('/foo', { method: 'PATCH' })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('PATCH method')
  })

  it('OPTIONS /foo', async () => {
    const res = await app.request('/foo', { method: 'OPTIONS' })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('OPTIONS method')
  })

  it('HEAD /foo is ok', async () => {
    // HEAD requests should return status 200 and no body
    const res = await app.request('/foo', { method: 'HEAD' })
    expect(res.status).toBe(200)
    expect(res.body).toBe(null)
  })

  suite('Path Parameters', () => {
    const builder = newHonoBuilder()

    builder.get('/echo/:message', (c) => {
      const message = c.req.param('message')
      return c.text(message)
    })

    builder.get('/posts/:id/comments/:commentId', (c) => {
      const id = c.req.param('id')
      const commentId = c.req.param('commentId')
      return c.json({ postId: id, commentId })
    })

    builder.get('/files/:path{.*}', (c) => {
      const path = c.req.param('path')
      return c.text(`File path: ${path}`)
    })

    const app = builder.build()

    it('GET /echo/:message is ok', async () => {
      const res = await app.request('/echo/hello')
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('hello')
    })

    it('GET /echo/:message with special characters', async () => {
      const res = await app.request('/echo/%F0%9F%94%A5')
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('🔥')
    })

    it('GET /posts/:id/comments/:commentId is ok', async () => {
      const res = await app.request('/posts/456/comments/789')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ postId: '456', commentId: '789' })
    })

    it('GET /files/:path with wildcard parameter is ok', async () => {
      const res = await app.request('/files/documents/readme.txt')
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('File path: documents/readme.txt')
    })
  })

  suite('Query Parameters', () => {
    const builder = newHonoBuilder()

    builder.get('/search', (c) => {
      const query = c.req.query('q')
      const page = c.req.query('page') || '1'
      return c.json({ query, page })
    })

    builder.get('/multi-values', (c) => {
      const tags = c.req.queries('tag') || []
      return c.json({ tags })
    })

    const app = builder.build()

    it('GET /search with query parameters is ok', async () => {
      const res = await app.request('/search?q=hono&page=2')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ query: 'hono', page: '2' })
    })

    it('GET /search without query parameters is ok', async () => {
      const res = await app.request('/search')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ query: undefined, page: '1' })
    })

    it('GET /multi-values with multiple query values is ok', async () => {
      const res = await app.request('/multi-values?tag=javascript&tag=typescript&tag=hono')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ tags: ['javascript', 'typescript', 'hono'] })
    })
  })

  suite('Chained Routes', () => {
    const builder = newHonoBuilder()

    builder
      .get('/chained/:id', (c) => {
        const id = c.req.param('id')
        return c.text(`GET: ${id}`)
      })
      .post((c) => {
        const id = c.req.param('id')
        return c.text(`POST: ${id}`)
      })
      .put((c) => {
        const id = c.req.param('id')
        return c.text(`PUT: ${id}`)
      })

    const app = builder.build()

    it('GET /chained/:id is ok', async () => {
      const res = await app.request('/chained/123')
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('GET: 123')
    })

    it('POST /chained/:id is ok', async () => {
      const res = await app.request('/chained/123', { method: 'POST' })
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('POST: 123')
    })

    it('PUT /chained/:id is ok', async () => {
      const res = await app.request('/chained/123', { method: 'PUT' })
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('PUT: 123')
    })
  })
})

describe('#all', () => {
  const builder = newHonoBuilder()

  // The `all` method handles ALL HTTP methods on a specific path
  builder.all('/wildcard', (c) => {
    const method = c.req.method
    return c.json({ method, message: `Handled ${method} request` })
  })

  // Test with a different route
  builder.all('/api/status', (c) => {
    return c.text('API is running')
  })

  const app = builder.build()

  it('GET /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'GET' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ method: 'GET', message: 'Handled GET request' })
  })

  it('POST /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'POST' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ method: 'POST', message: 'Handled POST request' })
  })

  it('PUT /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'PUT' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ method: 'PUT', message: 'Handled PUT request' })
  })

  it('DELETE /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ method: 'DELETE', message: 'Handled DELETE request' })
  })

  it('PATCH /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'PATCH' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ method: 'PATCH', message: 'Handled PATCH request' })
  })

  it('OPTIONS /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'OPTIONS' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ method: 'OPTIONS', message: 'Handled OPTIONS request' })
  })

  it('HEAD /wildcard is ok', async () => {
    const res = await app.request('/wildcard', { method: 'HEAD' })
    expect(res.status).toBe(200)
    // HEAD requests should return no body
    expect(res.body).toBe(null)
  })

  it('GET /api/status is ok', async () => {
    // Other routes can also be handled with all()
    const res = await app.request('/api/status')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('API is running')
  })
})

describe('#on', () => {
  const builder = newHonoBuilder()

  builder.on(['PUT', 'DELETE'], '/items/:id', (c) => {
    const id = c.req.param('id')
    const method = c.req.method
    return c.json({ id, method })
  })

  const app = builder.build()

  it('PUT /items/:id is ok', async () => {
    const res = await app.request('/items/123', { method: 'PUT' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ id: '123', method: 'PUT' })
  })

  it('DELETE /items/:id is ok', async () => {
    const res = await app.request('/items/123', { method: 'DELETE' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ id: '123', method: 'DELETE' })
  })

  it('POST /items/:id is 404', async () => {
    const res = await app.request('/items/123', { method: 'POST' })
    expect(res.status).toBe(404)
  })
})

describe('#use', () => {
  const builder = newHonoBuilder()

  // Global middleware
  builder.use('*', async (c, next) => {
    c.header('X-Global', 'global')
    await next()
  })

  // Route-specific middleware
  builder.use('/protected/*', async (c, next) => {
    const auth = c.req.header('Authorization')
    if (!auth || auth !== 'Bearer token') {
      return c.text('Unauthorized', 401)
    }
    await next()
  })

  builder.get('/public', (c) => c.text('Public route'))
  builder.get('/protected/secret', (c) => c.text('Secret data'))

  const app = builder.build()

  it('GET /public is ok with global middleware', async () => {
    const res = await app.request('/public')
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Global')).toBe('global')
    expect(await res.text()).toBe('Public route')
  })

  it('GET /protected/secret without authorization is unauthorized', async () => {
    const res = await app.request('/protected/secret')
    expect(res.status).toBe(401)
    expect(await res.text()).toBe('Unauthorized')
  })

  it('GET /protected/secret with authorization is ok', async () => {
    const res = await app.request('/protected/secret', {
      headers: { Authorization: 'Bearer token' },
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Global')).toBe('global')
    expect(await res.text()).toBe('Secret data')
  })
})

describe('#route', () => {
  const mainBuilder = newHonoBuilder()

  // Create a sub-app for users
  const usersBuilder = newHonoBuilder()
  usersBuilder.get('/', (c) => c.json({ message: 'List all users' }))
  usersBuilder.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ id, name: `User ${id}` })
  })
  usersBuilder.post('/', (c) => c.json({ message: 'Create user' }))
  const usersApp = usersBuilder.build()

  // Create a sub-app for posts
  const postsBuilder = newHonoBuilder()
  postsBuilder.get('/', (c) => c.json({ message: 'List all posts' }))
  postsBuilder.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ id, title: `Post ${id}` })
  })
  const postsApp = postsBuilder.build()

  // Mount sub-apps using route()
  mainBuilder.route('/users', usersApp)
  mainBuilder.route('/posts', postsApp)

  // Add a route to the main app
  mainBuilder.get('/', (c) => c.json({ message: 'Main app' }))

  const app = mainBuilder.build()

  it('should handle main app routes', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ message: 'Main app' })
  })

  it('should handle mounted users routes', async () => {
    const res = await app.request('/users')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ message: 'List all users' })
  })

  it('should handle mounted users route with parameter', async () => {
    const res = await app.request('/users/123')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ id: '123', name: 'User 123' })
  })

  it('should handle mounted users POST route', async () => {
    const res = await app.request('/users', { method: 'POST' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ message: 'Create user' })
  })

  it('should handle mounted posts routes', async () => {
    const res = await app.request('/posts')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ message: 'List all posts' })
  })

  it('should handle mounted posts route with parameter', async () => {
    const res = await app.request('/posts/456')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ id: '456', title: 'Post 456' })
  })

  it('should return 404 for non-existent routes', async () => {
    const res = await app.request('/nonexistent')
    expect(res.status).toBe(404)
  })

  suite('Nested mounting', () => {
    // Create a deeply nested structure
    const adminBuilder = newHonoBuilder()
    adminBuilder.get('/dashboard', (c) => c.json({ message: 'Admin dashboard' }))
    const adminApp = adminBuilder.build()

    const apiBuilder = newHonoBuilder()
    apiBuilder.route('/admin', adminApp)
    apiBuilder.get('/health', (c) => c.json({ status: 'OK' }))
    const apiApp = apiBuilder.build()

    const nestedBuilder = newHonoBuilder()
    nestedBuilder.route('/api/v1', apiApp)
    const nestedApp = nestedBuilder.build()

    it('should handle deeply nested routes', async () => {
      const res = await nestedApp.request('/api/v1/health')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ status: 'OK' })
    })

    it('should handle deeply nested admin routes', async () => {
      const res = await nestedApp.request('/api/v1/admin/dashboard')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ message: 'Admin dashboard' })
    })
  })
})

describe('#basePath', () => {
  const builder = newHonoBuilder()

  // Create an app with basePath using the basePath() method
  const apiBuilder = builder.basePath('/api/v1')

  // Add middleware specific to the base path
  apiBuilder.use('/*', async (c, next) => {
    c.header('X-API-Version', 'v1')
    await next()
  })

  apiBuilder.get('/users', (c) => c.json({ message: 'Get users' }))
  apiBuilder.post('/users', (c) => c.json({ message: 'Create user' }))
  apiBuilder.get('/users/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ id, name: `User ${id}` })
  })

  const app = apiBuilder.build()

  it('GET /api/v1/users is ok', async () => {
    const res = await app.request('/api/v1/users')
    expect(res.status).toBe(200)
    expect(res.headers.get('X-API-Version')).toBe('v1')
    const body = await res.json()
    expect(body).toEqual({ message: 'Get users' })
  })

  it('POST /api/v1/users is ok', async () => {
    const res = await app.request('/api/v1/users', { method: 'POST' })
    expect(res.status).toBe(200)
    expect(res.headers.get('X-API-Version')).toBe('v1')
    const body = await res.json()
    expect(body).toEqual({ message: 'Create user' })
  })

  it('GET /api/v1/users/:id is ok', async () => {
    const res = await app.request('/api/v1/users/123')
    expect(res.status).toBe(200)
    expect(res.headers.get('X-API-Version')).toBe('v1')
    const body = await res.json()
    expect(body).toEqual({ id: '123', name: 'User 123' })
  })

  it('GET /users is 404. Routes without basePath', async () => {
    const res = await app.request('/users')
    expect(res.status).toBe(404)
  })

  it('should return 404 for incorrect basePath', async () => {
    const res = await app.request('/api/v2/users')
    expect(res.status).toBe(404)
  })

  suite('Nested basePath', () => {
    // Test nested basePath functionality
    const mainBuilder = newHonoBuilder()

    // Create a sub-app with its own basePath
    const adminBuilder = newHonoBuilder().basePath('/admin')
    adminBuilder.get('/dashboard', (c) => c.json({ page: 'admin dashboard' }))
    adminBuilder.get('/users', (c) => c.json({ page: 'admin users' }))

    // Mount the admin app under another basePath
    const apiBuilder = mainBuilder.basePath('/api')
    apiBuilder.route('/admin', adminBuilder.build())

    // Add a regular route to the API
    apiBuilder.get('/status', (c) => c.json({ status: 'API running' }))

    const nestedApp = apiBuilder.build()

    it('should handle nested basePath routes', async () => {
      const res = await nestedApp.request('/api/status')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ status: 'API running' })
    })

    it('should handle deeply nested basePath routes', async () => {
      const res = await nestedApp.request('/api/admin/admin/dashboard')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ page: 'admin dashboard' })
    })

    it('should handle deeply nested basePath with parameters', async () => {
      const res = await nestedApp.request('/api/admin/admin/users')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ page: 'admin users' })
    })
  })

  suite('basePath with middleware', () => {
    const baseBuilder = newHonoBuilder()

    // Add global middleware
    baseBuilder.use('*', async (c, next) => {
      c.header('X-Global', 'true')
      await next()
    })

    // Create basePath app
    const versionedBuilder = baseBuilder.basePath('/v2')

    // Add middleware specific to v2
    versionedBuilder.use('/*', async (c, next) => {
      c.header('X-Version', 'v2')
      await next()
    })

    versionedBuilder.get('/test', (c) => c.json({ version: 'v2' }))

    const middlewareApp = versionedBuilder.build()

    it('should apply both global and basePath-specific middleware', async () => {
      const res = await middlewareApp.request('/v2/test')
      expect(res.status).toBe(200)
      expect(res.headers.get('X-Global')).toBe('true')
      expect(res.headers.get('X-Version')).toBe('v2')
      const body = await res.json()
      expect(body).toEqual({ version: 'v2' })
    })
  })
})

describe('#mount', () => {
  const builder = newHonoBuilder()

  // Simple application handler that returns a JSON response
  const simpleHandler = (request: Request) => {
    const url = new URL(request.url)
    return new Response(
      JSON.stringify({
        message: 'Simple mounted app',
        pathname: url.pathname,
        method: request.method,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    )
  }

  // Another application handler for testing multiple mounts
  const apiHandler = (request: Request) => {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname === '/status') {
      return new Response(JSON.stringify({ status: 'API OK' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    } else if (pathname === '/info') {
      return new Response(
        JSON.stringify({
          info: 'External API',
          method: request.method,
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    return new Response('Not Found', { status: 404 })
  }

  // Mount the handlers
  builder.mount('/external', simpleHandler)
  builder.mount('/api/external', apiHandler)

  // Add some regular routes to test coexistence
  builder.get('/regular', (c) => c.json({ type: 'regular route' }))
  builder.get('/external/override', (c) => c.json({ type: 'hono route override' }))

  const app = builder.build()

  it('should mount external application handler at /external', async () => {
    const res = await app.request('/external')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      message: 'Simple mounted app',
      pathname: '/',
      method: 'GET',
    })
  })

  it('should handle POST requests to mounted app', async () => {
    const res = await app.request('/external', { method: 'POST' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      message: 'Simple mounted app',
      pathname: '/',
      method: 'POST',
    })
  })

  it('should mount API handler at /api/external/status', async () => {
    const res = await app.request('/api/external/status')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ status: 'API OK' })
  })

  it('should mount API handler at /api/external/info', async () => {
    const res = await app.request('/api/external/info')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      info: 'External API',
      method: 'GET',
    })
  })

  it('should return 404 for non-existent paths in mounted app', async () => {
    const res = await app.request('/api/external/nonexistent')
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Not Found')
  })

  it('should handle regular Hono routes alongside mounted apps', async () => {
    const res = await app.request('/regular')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ type: 'regular route' })
  })

  it('should prioritize mounted apps over Hono routes for same path', async () => {
    // This tests route precedence - the mounted app should take priority
    const res = await app.request('/external/override')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      message: 'Simple mounted app',
      pathname: '/override',
      method: 'GET',
    })
  })

  it('should return 404 for non-mounted paths', async () => {
    const res = await app.request('/nonmounted')
    expect(res.status).toBe(404)
  })

  suite('Async mounted handlers', () => {
    const asyncBuilder = newHonoBuilder()

    // Async application handler
    const asyncHandler = async (request: Request) => {
      await new Promise((resolve) => setTimeout(resolve, 10)) // Small delay
      const url = new URL(request.url)
      return new Response(
        JSON.stringify({
          message: 'Async mounted app',
          pathname: url.pathname,
          timestamp: Date.now(),
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    asyncBuilder.mount('/async', asyncHandler)
    const asyncApp = asyncBuilder.build()

    it('should handle async mounted application handlers', async () => {
      const res = await asyncApp.request('/async')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({
        message: 'Async mounted app',
        pathname: '/',
        timestamp: expect.any(Number),
      })
    })
  })

  suite('Error handling in mounted apps', () => {
    const errorBuilder = newHonoBuilder()

    // Handler that throws an error
    const errorHandler = (request: Request) => {
      const url = new URL(request.url)
      if (url.pathname === '/error') {
        throw new Error('Mounted app error')
      }
      return new Response('OK', { status: 200 })
    }

    errorBuilder.mount('/error-app', errorHandler)
    const errorApp = errorBuilder.build()

    it('should handle errors in mounted applications gracefully', async () => {
      // The exact behavior may depend on how Hono handles errors in mounted apps
      // This test ensures the error doesn't crash the entire application
      try {
        const res = await errorApp.request('/error-app/error')
        // The response might be a 500 error or be handled by Hono's error handling
        expect([500, 404].includes(res.status)).toBe(true)
      } catch (error) {
        // If the error bubbles up, that's also acceptable behavior
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should handle successful requests to error-prone mounted app', async () => {
      const res = await errorApp.request('/error-app/success')
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('OK')
    })
  })
})

describe('routes', () => {
  const builder = newHonoBuilder()

  builder.get('/foo', (c) => c.text('Foo'))

  const app = builder.build()

  // Add a route after build()
  builder.get('/bar', (c) => c.text('Bar'))

  it('GET /foo is ok', async () => {
    const res = await app.request('/foo')
    expect(res.status).toBe(200)
    expect(await res.text()).toEqual('Foo')
  })

  it('GET /bar is ok. /bar route added after build()', async () => {
    const res = await app.request('/bar')
    expect(res.status).toBe(200)
    expect(await res.text()).toEqual('Bar')
  })

  suite('newly built app', () => {
    // The newly built app should have both routes
    const newApp = builder.build()

    it('GET /foo is ok', async () => {
      const res = await newApp.request('/foo')
      expect(res.status).toBe(200)
      expect(await res.text()).toEqual('Foo')
    })

    it('GET /bar is ok', async () => {
      const res = await newApp.request('/bar')
      expect(res.status).toBe(200)
      expect(await res.text()).toEqual('Bar')
    })
  })
})

describe('router', () => {
  const builder = newHonoBuilder()
  const app = builder.build()

  it('should be Hono.router', () => {
    expect(builder.router).toEqual(app.router)
  })
})
