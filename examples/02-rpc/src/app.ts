import './routes/_404'
import './routes/_error'
import './routes/api'

export type { ApiType } from './routes/api'

import { builder } from './builder';

export const app = builder.build()
