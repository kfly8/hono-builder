import { builder } from '@/builder'

builder.get('/r8/health', (c) => {
  return c.json({
    status: 'healthy',
    group: 'r8',
    timestamp: Date.now(),
    environment: 'cloudflare-worker',
    version: '1.0.0'
  })
})
