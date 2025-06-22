import '@/routes/_404'
import '@/routes/_error'

// Load all routes in development environment
import.meta.glob('@/routes/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

import { builder } from '@/builder';

const app = builder.build()

export default app
