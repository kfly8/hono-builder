import { builder } from '@/builder'

builder.get('/r5/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r5',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
