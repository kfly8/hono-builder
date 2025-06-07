import './routes/_404'
import './routes/_error'

// Import all other routes
import.meta.glob('./routes/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

import { builder } from './builder';

export const app = builder.build()

