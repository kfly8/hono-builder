import builder from '../../builder'
import { posts, content } from './data'

builder.get('/blog/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const post = posts.find(p => p.id === id)

  if (!post) {
    return c.render(
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
        <a href="/blog">← Back to Blog</a>
      </div>
    )
  }


  return c.render(
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <article>
        <h1>{post.title}</h1>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>
          By {post.author} • {post.date}
        </div>

        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {content[post.id]}
        </div>
      </article>

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <a href="/blog">← Back to Blog</a>
      </div>
    </div>
  )
})
