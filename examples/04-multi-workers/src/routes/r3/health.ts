import { builder } from '@/builder'

builder.get('/r3/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r3',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
