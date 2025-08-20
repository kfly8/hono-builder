import { describe, it, expect, suite } from 'vitest'
import builder from '../../builder'

import './[id]'
const app = builder.build()

describe('GET /blog/:id', () => {
  suite('Valid blog post', () => {
    it('should return specific blog post', async () => {
      const res = await app.request('/blog/1')

      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toContain('text/html')
    })

    it('should display post 1 content', async () => {
      const res = await app.request('/blog/1')
      const html = await res.text()

      expect(html).toContain('Essential Japanese Phrases for Travelers')
      expect(html).toContain('By Sakura')
      expect(html).toContain('2024-01-15')
      expect(html).toContain('Konnichiwa')
      expect(html).toContain('Arigatou gozaimasu')
    })

    it('should display post 2 content', async () => {
      const res = await app.request('/blog/2')
      const html = await res.text()

      expect(html).toContain('The Art of Sushi: A Culinary Journey')
      expect(html).toContain('By Taro')
      expect(html).toContain('2024-01-10')
      expect(html).toContain('Hanaya Yohei')
      expect(html).toContain('Edomae-zushi')
    })

    it('should display post 3 content', async () => {
      const res = await app.request('/blog/3')
      const html = await res.text()

      expect(html).toContain('Mount Fuji: Japan')
      expect(html).toContain('By Yuki')
      expect(html).toContain('2024-01-05')
      expect(html).toContain('3,776 meters')
      expect(html).toContain('UNESCO World Heritage')
    })

    it('should contain navigation links', async () => {
      const res = await app.request('/blog/1')
      const html = await res.text()

      expect(html).toContain('href="/blog"')
      expect(html).toContain('Back to Blog')
    })
  })

  suite('Invalid blog post', () => {
    it('should return 404 for non-existent post', async () => {
      const res = await app.request('/blog/999')
      const html = await res.text()

      expect(res.status).toBe(200)
      expect(html).toContain('Post Not Found')
      expect(html).toContain('looking for')
      expect(html).toContain('href="/blog"')
    })

    it('should handle invalid id format', async () => {
      const res = await app.request('/blog/invalid')
      const html = await res.text()

      expect(res.status).toBe(200)
      expect(html).toContain('Post Not Found')
    })
  })

  suite('Content structure', () => {
    it('should have consistent article structure', async () => {
      const res = await app.request('/blog/1')
      const html = await res.text()

      expect(html).toContain('<article>')
      expect(html).toContain('<h1>')
      expect(html).toContain('By Sakura')
    })
  })
})
