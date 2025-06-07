import { HonoBuilder } from 'hono-builder'
import { logger } from 'hono/logger'

const builder = new HonoBuilder()

builder.use(logger())

export { builder }
