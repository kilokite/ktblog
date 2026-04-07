import { Hono } from 'hono'
import { inc } from '../lib/stats.js'
import auth from './auth.js'
import posts from './posts.js'
import categories from './categories.js'
import tags from './tags.js'
import stats from './stats.js'
import siteConfig from './site-config.js'

let num = 0

const api = new Hono()
  .use(async (c, next) => { inc('api_request'); await next() })
  .get('/random', (c) => {
    return c.json({ value: num++ })
  })
  .get('/hello2', (c) => {
    const input = c.req.query('input') ?? ''
    return c.json({ message: `Hello, ${input}!` })
  })
  .route('/auth', auth)
  .route('/posts', posts)
  .route('/categories', categories)
  .route('/tags', tags)
  .route('/stats', stats)
  .route('/site-config', siteConfig)

export type ApiType = typeof api
export default api
