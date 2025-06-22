import { builder } from '@/builder'

builder.get('/r6/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r6',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
