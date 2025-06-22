import '@/routes/_404'
import '@/routes/_error'

import.meta.glob('@/routes/(r4|r5|r6)/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

import { builder } from '@/builder';

const app = builder.build()

export default app
