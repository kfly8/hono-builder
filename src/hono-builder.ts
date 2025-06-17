/**
 * @module
 * This module is a builder pattern for Hono framework.
 */

import { Hono } from 'hono'
import type { Env, Schema, Context, NotFoundHandler, ErrorHandler } from 'hono'
import type { HonoOptions } from 'hono/hono-base'
import type { MergePath, MergeSchemaPath } from 'hono/types'

// Forbidden methods in HonoBuilder
const FORBIDDEN_METHODS = new Set(['fetch', 'request', 'fire', 'notFound', 'onError'])

// Methods that should be delegated to Hono and wrapped with createProxy
const DELEGATION_METHODS = new Set(['basePath', 'route', 'mount'])

// XXX: The following types are copied from hono-base.ts
type MountOptionHandler = (c: Context) => unknown
type MountReplaceRequest = (originalRequest: Request) => Request
type MountOptions =
  | MountOptionHandler
  | {
      optionHandler?: MountOptionHandler
      replaceRequest?: MountReplaceRequest | false
    }

/**
 * HonoBuilder interface provides a builder pattern for constructing Hono applications.
 *
 * This interface extends the standard Hono interface but disables certain runtime methods
 * like `fetch`, `request`, and `fire` to enforce the builder pattern. Once you've configured
 * your routes and middleware, call `build()` to create the final Hono instance.
 *
 * @template E - Environment type
 * @template S - Schema type for type-safe routing
 * @template BasePath - Base path string for the routes
 */
export interface HonoBuilder<
  E extends Env = Env,
  S extends Schema = {},
  BasePath extends string = '/'
> extends Hono<E, S, BasePath> {
  /**
   * Build a new Hono instance with the configured routes
   *
   * @returns {Hono} A new Hono instance.
   *
   * @example
   *
   * ```typescript
   * import { honoBuilder } from 'hono-builder'
   *
   * const builder = honoBuilder()
   *
   * builder.get('/hello', (c) => {
   *   return c.json({ message: 'Hello, World!' })
   * })
   *
   * const app = builder.build()
   * // => Now you can use `app` as a Hono app.
   * ```
   */
  build: () => Hono<E, S, BasePath>

  /**
   * `.setNotFoundHandler()` allows you to customize a Not Found Response.
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
  setNotFoundHandler: (handler: NotFoundHandler<E>) => HonoBuilder<E, S, BasePath>

  /**
   * `.setErrorHandler()` handles an error and returns a customized Response.
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
  setErrorHandler: (handler: ErrorHandler<E>) => HonoBuilder<E, S, BasePath>

  basePath<SubPath extends string>(path: SubPath): HonoBuilder<E, S, MergePath<BasePath, SubPath>>

  route<
    SubPath extends string,
    SubEnv extends Env,
    SubSchema extends Schema,
    SubBasePath extends string
  >(
    path: SubPath,
    app: Hono<SubEnv, SubSchema, SubBasePath>
  ): HonoBuilder<E, MergeSchemaPath<SubSchema, MergePath<BasePath, SubPath>> | S, BasePath>

  mount(
    path: string,
    applicationHandler: (request: Request, ...args: unknown[]) => Response | Promise<Response>,
    options?: MountOptions
  ): HonoBuilder<E, S, BasePath>

  /**
   * `.fetch()` disabled in HonoBuilder
   * @override
   */
  fetch: never

  /**
   * `.request()` disabled in HonoBuilder
   * @override
   */
  request: never

  /**
   * `.fire()` disabled in HonoBuilder
   * @override
   */
  fire: never

  /**
   * `.notFound()` disabled in HonoBuilder.
   * If you want to set a custom not found handler, use `setNotFoundHandler`.
   * @override
   */
  notFound: never

  /**
   * `.onError()` disabled in HonoBuilder.
   * If you want to set a custom error handler, use `setErrorHandler`.
   * @override
   */
  onError: never
}

/**
 * Creates a new HonoBuilder instance with optional configuration.
 *
 * The HonoBuilder provides a fluent interface for building Hono applications
 * using the builder pattern. You can chain method calls to configure routes,
 * middleware, and other settings, then call `build()` to create the final
 * Hono instance ready for deployment.
 *
 * **Performance & Learning Cost:**
 * - Zero runtime overhead: HonoBuilder is essentially a type-safe wrapper around Hono
 * - No additional abstractions or middleware layers are introduced
 * - Learning cost is minimal as it uses the same API as standard Hono
 * - The implementation only adds type constraints and method restrictions
 *
 * **Important Note:**
 * The `build()` method returns the same underlying Hono instance, not a copy.
 * This means router and routes are shared between the builder and the built app.
 * Any modifications to the built app (e.g., adding new routes) will also affect
 * the original builder instance.
 *
 * @template E - Environment type for the Hono instance
 * @template S - Schema type for type-sfe routing
 * @template BasePath - Base path string for all routes
 * @param options - Optional Hono configuration options
 * @returns A new HonoBuilder instance
 *
 * @example
 * ```typescript
 * import { honoBuilder } from 'hono-builder'
 *
 * const builder = honoBuilder()
 *   .get('/users', getUsersHandler)
 *   .post('/users', createUserHandler)
 *   .basePath('/api/v1')
 *
 * const app = builder.build()
 *
 * // Warning: This will also affect the original builder
 * app.get('/admin', adminHandler)
 *
 * export default app
 * ```
 */
export function honoBuilder<
  E extends Env = Env,
  S extends Schema = {},
  BasePath extends string = '/'
>(options?: HonoOptions<E>): HonoBuilder<E, S, BasePath> {
  const hono = new Hono<E, S, BasePath>(options) as HonoBuilder<E, S, BasePath>

  const createProxy = (target: typeof hono): typeof hono => {
    return new Proxy(target, {
      get(target, prop, receiver) {
        if (prop === 'build') {
          return () => target as Hono<E, S, BasePath>
        } else if (prop === 'setNotFoundHandler') {
          const originalMethod = target.notFound as Function
          return function (this: typeof target, ...args: unknown[]) {
            const result = originalMethod.apply(target, args)
            return createProxy(result)
          }
        } else if (prop === 'setErrorHandler') {
          const originalMethod = target.onError as Function
          return function (this: typeof target, ...args: unknown[]) {
            const result = originalMethod.apply(target, args)
            return createProxy(result)
          }
        } else if (DELEGATION_METHODS.has(String(prop))) {
          return createDelegatingMethod(target, prop as keyof typeof target, createProxy)
        } else if (FORBIDDEN_METHODS.has(String(prop))) {
          throw new Error(`.${String(prop)} is not available in HonoBuilder`)
        } else {
          return Reflect.get(target, prop, receiver)
        }
      },
    })
  }

  return createProxy(hono)
}

/**
 * Helper function to create a delegating method that wraps the result with createProxy
 */
function createDelegatingMethod<T>(target: T, methodName: keyof T, createProxy: (result: T) => T) {
  const originalMethod = target[methodName] as Function
  return function (this: T, ...args: unknown[]) {
    const result = originalMethod.apply(target, args)
    return createProxy(result)
  }
}
