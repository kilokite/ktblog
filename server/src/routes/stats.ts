import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.js'
import { snapshot } from '../lib/stats.js'

const stats = new Hono()
  .use(authMiddleware)
  .get('/', (c) => c.json(snapshot()))

export default stats
