import { honoBuilder } from 'hono-builder'
import { logger } from 'hono/logger'
import { renderer } from './renderer'

const builder = honoBuilder()

builder.use(logger())
builder.use(renderer)

export default builder
