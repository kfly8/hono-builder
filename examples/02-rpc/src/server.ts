import './routes/_404'
import './routes/_error'
import './routes/api'

export type { ApiType } from './routes/api'

import { builder } from './builder';

const app = builder.build()

export default app
