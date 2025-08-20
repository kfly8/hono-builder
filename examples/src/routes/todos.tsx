import b from '../builder'

const builder = b.basePath('/todos')

let todos = [
  { id: 1, title: 'Learn Hono', completed: false },
  { id: 2, title: 'Build an app', completed: false },
  { id: 3, title: 'Deploy to production', completed: false }
]

builder.get('/', (c) => {
  return c.render(
    <div>
      <h1>Todo List</h1>

      <form action="/todos" method="post" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="title"
          placeholder="Enter a new todo..."
          required
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>
          Add Todo
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <form action={`/todos/${todo.id}/toggle`} method="post" style={{ margin: 0 }}>
              <button
                type="submit"
                style={{
                  width: '20px',
                  height: '20px',
                  padding: 0,
                  border: '2px solid #333',
                  borderRadius: '3px',
                  background: todo.completed ? '#333' : 'white',
                  cursor: 'pointer',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {todo.completed && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
              </button>
            </form>
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#000'
            }}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <a href="/">← Back to Home</a>
      </div>
    </div>
  )
})

builder.post('/', async (c) => {
  const formData = await c.req.formData()
  const title = formData.get('title')

  if (title) {
    const newTodo = {
      id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      title: title.toString(),
      completed: false
    }
    todos.push(newTodo)
  }

  return c.redirect('/todos')
})

builder.post('/:id/toggle', async (c) => {
  const id = parseInt(c.req.param('id'))
  const todo = todos.find(t => t.id === id)

  if (todo) {
    todo.completed = !todo.completed
  }

  return c.redirect('/todos')
})
