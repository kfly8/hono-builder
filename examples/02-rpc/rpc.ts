import type { ApiType } from './src/server'
import { hc } from 'hono/client'

const client = hc<ApiType>('http://localhost:3000')

const res = await client.api.hello.$get()
const data = await res.json()
console.log(data)
// => { message: 'Hello, world!' }
