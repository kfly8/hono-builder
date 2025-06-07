import './routes/_404'
import './routes/_error'
import './routes/root'

import { builder } from './builder';

const app = builder.build()

export default app
