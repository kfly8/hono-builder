import { describe, it, expect, vi, beforeEach } from 'vitest'
import builder from '../../builder'

import './status'

describe('/api/status', () => {
  const app = builder.build()

  beforeEach(() => {
    // Mock process.uptime() to return consistent values
    vi.spyOn(process, 'uptime').mockReturnValue(123.456)

    // Mock Date to return consistent timestamps
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:30:00.000Z'))
  })

  it('should return status', async () => {
    const res = await app.request('/api/status')

    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual({
      status: 'ok',
      timestamp: '2024-01-15T10:30:00.000Z',
      uptime: 123.456
    })
  })
})

