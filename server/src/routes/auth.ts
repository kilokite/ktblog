import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { verifyPassword, generateToken, hashToken } from '../lib/crypto.js'
import { userPublicSelect } from '../lib/select.js'
import { inc } from '../lib/stats.js'

const auth = new Hono()
  .post('/login',
    zValidator('json', z.object({
      username: z.string(),
      password: z.string(),
    })),
    async (c) => {
      const { username, password } = c.req.valid('json')
      const user = await prisma.user.findUnique({
        where: { username },
        select: { passwordHash: true, ...userPublicSelect },
      })
      if (!user || !verifyPassword(password, user.passwordHash)) {
        inc('auth_fail')
        return c.json({ success: false as const })
      }
      inc('auth_login')
      const token = generateToken()
      await prisma.authToken.create({
        data: { tokenHash: hashToken(token), userId: user.id },
      })
      const { passwordHash: _, ...publicUser } = user
      return c.json({
        success: true as const,
        token,
        user: publicUser,
      })
    }
  )

export default auth
