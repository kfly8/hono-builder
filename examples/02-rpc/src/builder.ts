import { newHonoBuilder } from 'hono-builder'
import { logger } from 'hono/logger'

const builder = newHonoBuilder()

builder.use(logger())

export { builder }
