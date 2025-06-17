import { honoBuilder } from 'hono-builder'
import { logger } from 'hono/logger'

type Env = {
  Variables: {
    message: string
  }
}

const builder = honoBuilder<Env>()

builder.use(async (c, next) => {
  c.set('message', 'Hono is awesome!!')
  await next()
})

builder.use(logger())

export { builder }
