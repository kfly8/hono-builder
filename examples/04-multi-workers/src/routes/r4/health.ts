import { builder } from '@/builder'

builder.get('/r4/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r4',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
