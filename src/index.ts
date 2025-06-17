/**
 * @module
 *
 * HonoBuilder - Builder pattern for Hono framework.
 *
 * @example
 * ```ts
 * import { newHonoBuilder } from 'hono-builder'
 *
 * const builder = newHonoBuilder()
 *
 * builder.get('/', (c) => c.text('HonoBuilder!'))
 *
 * // Build the Hono app
 * const app = builder.build()
 *
 * export default app
 * ```
 */

import { newHonoBuilder } from './hono-builder'
import type { HonoBuilder } from './hono-builder'

export type { HonoBuilder }

/**
 * Builder for Hono framework
 */
export { newHonoBuilder }
