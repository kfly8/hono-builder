/**
 * @module
 * This module is a builder class for Hono.
 */

import { Hono } from 'hono'
import type { Env, Schema, NotFoundHandler, ErrorHandler } from 'hono'
import type { HonoOptions } from 'hono/hono-base'

export class HonoBuilder<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'> extends Hono<E,S,BasePath> {
  #notFoundHandler: NotFoundHandler<E> | undefined
  #errorHandler: ErrorHandler<E> | undefined

  /**
   * Construct with same option as Hono constructor.
   *
   * @param options - same options as Hono constructor.
   *
   * @example
   *
   * ```typescript
   * const builder = new HonoBuilder()
   *
   * // Define routes
   * builder.get('/hello', (c) => c.json({ message: 'Hello!' }))
   *
   * // Build the Hono app
   * const app = builder.build()
   * ```
   */
  constructor(options?: HonoOptions<E>) {
    super(options)
  }

  /**
   * Build a new Hono instance with the configured routes
   *
   * @returns {Hono} A new Hono instance.
   *
   * @example
   *
   * ```typescript
   * import { HonoBuilder } from 'hono-builder'
   *
   * const builder = new HonoBuilder()
   *
   * builder.get('/hello', (c) => {
   *   return c.json({ message: 'Hello, World!' })
   * })
   *
   * const app = builder.build()
   * // => Now you can use `app` as a Hono app.
   */
  build() {
    const app = new Hono<E,S,BasePath>({
      router: this.router,
      getPath: this.getPath,
    })

    if (this.#errorHandler !== undefined) {
      app.onError(this.#errorHandler)
    }

    if (this.#notFoundHandler !== undefined) {
      app.notFound(this.#notFoundHandler)
    }

    app.routes = this.routes

    return app
  }

  /**
   * `builder.setNotFoundHandler` allows you to customize a Not Found Response.
   *
   * @see https://hono.dev/docs/api/hono#not-found
   *
   * @example
   *
   * ```typescript
   * builder.setNotFoundHandler((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   * Note: builder.notFound is disabled in HonoBuilder.
   */
  setNotFoundHandler(handler: NotFoundHandler<E>) {
    this.#notFoundHandler = handler
  }

  /**
   * `builder.setErrorHandler` handles an error and returns a customized Response.
   *
   * @see https://hono.dev/docs/api/hono#error-handling
   *
   * @example
   *
   * ```typescript
   * builder.setErrorHandler((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   * Note: builder.onError is disabled in HonoBuilder.
   */
  setErrorHandler(handler: ErrorHandler<E>) {
    this.#errorHandler = handler
  }

  // Following methods are disabled in HonoBuilder to prevent mistake.
  // HonoBuilder is just a builder class for Hono, it should not be Hono.

  /**
   * `.fetch()` disabled in HonoBuilder
   * @override
   */
  declare fetch: never

  /**
   * `.request()` disabled in HonoBuilder
   * @override
   */
  declare request: never

  /**
   * `.fire()` disabled in HonoBuilder
   * @override
   */
  declare fire: never

  /**
   * `.notFound()` disabled in HonoBuilder.
   * If you want to set a custom not found handler, use `setNotFoundHandler`.
   * @override
   */
  declare notFound: never

  /**
   * `.onError()` disabled in HonoBuilder.
   * If you want to set a custom error handler, use `setErrorHandler`.
   * @override
   */
  declare onError: never
}
