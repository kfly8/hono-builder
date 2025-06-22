import { builder } from '@/builder'

builder.get('/r7/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r7',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
