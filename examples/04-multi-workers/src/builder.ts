import { honoBuilder } from 'hono-builder'
import { logger } from 'hono/logger'

const builder = honoBuilder()

builder.use(logger())

export { builder }
