import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { TOKEN } from '../middleware/auth.js'

const auth = new Hono()
  .post('/login',
    zValidator('json', z.object({
      username: z.string(),
      password: z.string(),
    })),
    (c) => {
      const { username, password } = c.req.valid('json')
      if (username !== 'admin' || password !== 'admin') {
        return c.json({ success: false as const })
      }
      return c.json({ success: true as const, token: TOKEN })
    }
  )

export default auth
