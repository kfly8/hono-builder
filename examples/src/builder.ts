import { Hono } from 'hono'

import { logger } from 'hono/logger'
import { renderer } from './renderer'

const builder = new Hono()

builder.use(logger())
builder.use(renderer)

export default builder
