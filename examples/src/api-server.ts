
// Import api routes
import './routes/api/_404'
import './routes/api/_error'
import.meta.glob('./routes/api/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

import builder from './builder';

const app = builder

export default app
