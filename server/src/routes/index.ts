import { Hono } from 'hono'
import auth from './auth.js'

let num = 0

const api = new Hono()
  .get('/random', (c) => {
    return c.json({ value: num++ })
  })
  .get('/hello2', (c) => {
    const input = c.req.query('input') ?? ''
    return c.json({ message: `Hello, ${input}!` })
  })
  .route('/auth', auth)

export type ApiType = typeof api
export default api
