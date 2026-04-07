import { createMiddleware } from 'hono/factory'
import type { UserType } from '../../generated/prisma/enums.js'
import { prisma } from '../lib/prisma.js'
import { hashToken } from '../lib/crypto.js'
import { userPublicSelect } from '../lib/select.js'

export type AuthUser = {
  id: string
  username: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  userType: UserType
}

type AuthEnv = {
  Variables: { user: AuthUser }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const header = c.req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return c.json({ error: 'unauthorized' }, 401)

  const row = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: userPublicSelect } },
  })
  if (!row) return c.json({ error: 'unauthorized' }, 401)

  c.set('user', row.user)
  await next()
})
