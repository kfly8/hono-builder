import builder from '../builder'

builder.get('/', (c) => {
  return c.render(
    <div>
      <h1>Hono Builder Examples</h1>
      <p>Welcome to Hono Builder! This is a collection of example routes.</p>

      <h2>Pages</h2>
      <ul>
        <li><a href="/blog">Blog</a> - Read articles and tutorials</li>
        <li><a href="/todos">Todo List</a> - Manage your tasks</li>
      </ul>

      <h2>API Endpoints</h2>
      <h3>Status</h3>
      <ul>
        <li><code>GET <a href="/api/status">/api/status</a></code> - Check API health</li>
      </ul>

      <h3>Users</h3>
      <ul>
        <li><code>GET <a href="/api/users">/api/users</a></code> - List all users</li>
        <li><code>GET /api/users/:id</code> - Get user by ID (e.g., <a href="/api/users/1">/api/users/1</a>)</li>
      </ul>
    </div>,
  )
})
