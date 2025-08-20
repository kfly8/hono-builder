import builder from '../../builder'
import { posts } from './data'

builder.get('/blog', (c) => {
  return c.render(
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Blog</h1>
      <p>Latest articles and tutorials</p>
      
      <div style={{ marginTop: '30px' }}>
        {posts.map(post => (
          <article key={post.id} style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ marginBottom: '10px' }}>
              <a href={`/blog/${post.id}`} style={{ color: '#333', textDecoration: 'none' }}>
                {post.title}
              </a>
            </h2>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              By {post.author} • {post.date}
            </div>
            <p style={{ lineHeight: '1.6' }}>{post.excerpt}</p>
            <a href={`/blog/${post.id}`} style={{ color: '#0066cc' }}>Read more →</a>
          </article>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <a href="/">← Back to Home</a>
      </div>
    </div>
  )
})

