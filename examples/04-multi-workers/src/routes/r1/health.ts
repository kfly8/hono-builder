import { builder } from '@/builder'

builder.get('/r1/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r1',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
