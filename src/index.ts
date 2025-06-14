/**
 * @module
 *
 * HonoBuilder - Builder class for Hono framework.
 *
 * @example
 * ```ts
 * import { HonoBuilder } from 'hono-builder'
 *
 * const builder = new HonoBuilder()
 *
 * builder.get('/', (c) => c.text('HonoBuilder!'))
 *
 * // Build the Hono app
 * const app = builder.build()
 *
 * export default app
 * ```
 */

import { HonoBuilder } from './hono-builder'

/**
 * Builder class for Hono framework
 */
export { HonoBuilder }
