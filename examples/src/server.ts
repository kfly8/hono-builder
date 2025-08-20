import { showRoutes } from 'hono/dev'

// Import necessary routes
import './routes/_404'
import './routes/_error'
import.meta.glob('./routes/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

import builder from './builder';

const app = builder.build()

showRoutes(app, {
  verbose: true,
})

export default app
