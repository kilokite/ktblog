import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'
import { userPublicSelect } from '../lib/select.js'

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).max(180),
  content: z.string(),
  summary: z.string().optional(),
  coverUrl: z.string().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
  seriesOrder: z.number().int().optional(),
  tagIds: z.array(z.string()).optional(),
})

const updateSchema = createSchema.partial()

const publicAuthorSelect = { displayName: true } as const

const postInclude = {
  author: { select: userPublicSelect },
  category: true,
  tags: { include: { tag: true } },
}

const publicPostInclude = {
  author: { select: publicAuthorSelect },
  category: true,
  tags: { include: { tag: true } },
}

const listSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  coverUrl: true,
  published: true,
  publishedAt: true,
  createdAt: true,
  author: { select: userPublicSelect },
  category: true,
  tags: { select: { tag: true } },
}

const publicListSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  coverUrl: true,
  publishedAt: true,
  createdAt: true,
  author: { select: publicAuthorSelect },
  category: true,
  tags: { select: { tag: true } },
}

const posts = new Hono()
  .get('/manage', authMiddleware, async (c) => {
    const page = Math.max(1, Number(c.req.query('page') ?? 1))
    const size = Math.min(100, Math.max(1, Number(c.req.query('size') ?? 20)))
    const pub = c.req.query('published')
    const search = c.req.query('search')

    const where = {
      ...(pub !== undefined && { published: pub === 'true' }),
      ...(search && { title: { contains: search } }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: listSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.post.count({ where }),
    ])

    return c.json({ posts, total, page, size })
  })
  .get('/manage/:id', authMiddleware, async (c) => {
    const post = await prisma.post.findUnique({
      where: { id: c.req.param('id') },
      include: { ...postInclude, series: true },
    })
    if (!post) return c.json({ error: 'not_found' }, 404)
    return c.json(post)
  })
  .get('/', async (c) => {
    const page = Math.max(1, Number(c.req.query('page') ?? 1))
    const size = Math.min(100, Math.max(1, Number(c.req.query('size') ?? 20)))
    const categoryId = c.req.query('categoryId')
    const tagId = c.req.query('tagId')

    const where = {
      published: true,
      ...(categoryId && { categoryId }),
      ...(tagId && { tags: { some: { tagId } } }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: publicListSelect,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.post.count({ where }),
    ])

    return c.json({ posts, total, page, size })
  })
  .get('/:slug', async (c) => {
    const post = await prisma.post.findFirst({
      where: { slug: c.req.param('slug'), published: true },
      include: { ...publicPostInclude, series: true },
    })
    if (!post) return c.json({ error: 'not_found' }, 404)
    return c.json(post)
  })
  .post('/', authMiddleware, zValidator('json', createSchema), async (c) => {
    const { tagIds, ...fields } = c.req.valid('json')
    const user = c.get('user')

    const post = await prisma.post.create({
      data: {
        ...fields,
        authorId: user.id,
        publishedAt: fields.published ? new Date() : undefined,
        tags: tagIds?.length
          ? { createMany: { data: tagIds.map((tagId) => ({ tagId })) } }
          : undefined,
      },
      include: postInclude,
    })

    return c.json(post, 201)
  })
  .put('/:id', authMiddleware, zValidator('json', updateSchema), async (c) => {
    const id = c.req.param('id')
    const { tagIds, ...fields } = c.req.valid('json')

    const post = await prisma.$transaction(async (tx) => {
      let publishedAt: Date | undefined
      if (fields.published === true) {
        const existing = await tx.post.findUnique({
          where: { id },
          select: { published: true },
        })
        if (existing && !existing.published) publishedAt = new Date()
      }

      if (tagIds) {
        await tx.postTag.deleteMany({ where: { postId: id } })
        if (tagIds.length) {
          await tx.postTag.createMany({
            data: tagIds.map((tagId) => ({ postId: id, tagId })),
          })
        }
      }

      return tx.post.update({
        where: { id },
        data: { ...fields, publishedAt },
        include: postInclude,
      })
    })

    return c.json(post)
  })
  .delete('/:id', authMiddleware, async (c) => {
    await prisma.post.delete({ where: { id: c.req.param('id') } })
    return c.json({ success: true })
  })

export default posts
