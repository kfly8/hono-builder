import { builder } from '@/builder'

builder.get('/r9/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r9',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
