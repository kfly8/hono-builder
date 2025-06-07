import './routes/_404'
import './routes/_error'
import './routes/root'

import { builder } from './builder';

export const app = builder.build()
