import { createMiddleware } from 'hono/factory'

export const TOKEN = '123456'

type AuthEnv = {
  Variables: { user: { username: string } }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (token !== TOKEN) return c.json({ error: 'unauthorized' }, 401)
  c.set('user', { username: 'admin' })
  await next()
})
