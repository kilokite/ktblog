import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'

const body = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

const tags = new Hono()
  .get('/', async (c) => {
    const list = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
    return c.json(list)
  })
  .post('/', authMiddleware, zValidator('json', body), async (c) => {
    const data = c.req.valid('json')
    const tag = await prisma.tag.create({ data })
    return c.json(tag, 201)
  })
  .put('/:id', authMiddleware, zValidator('json', body.partial()), async (c) => {
    const tag = await prisma.tag.update({
      where: { id: c.req.param('id') },
      data: c.req.valid('json'),
    })
    return c.json(tag)
  })
  .delete('/:id', authMiddleware, async (c) => {
    await prisma.tag.delete({ where: { id: c.req.param('id') } })
    return c.json({ success: true })
  })

export default tags
