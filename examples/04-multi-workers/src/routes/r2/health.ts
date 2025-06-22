import { builder } from '@/builder'

builder.get('/r2/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r2',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
