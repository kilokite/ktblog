import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth.js'
import {
  getSiteConfig,
  updateSiteConfig,
  siteConfigPatchSchema,
} from '../lib/site-config.js'

const siteConfig = new Hono()
  .get('/', async (c) => c.json(await getSiteConfig()))
  .put(
    '/',
    authMiddleware,
    zValidator('json', siteConfigPatchSchema),
    async (c) => {
      const patch = c.req.valid('json')
      const updated = await updateSiteConfig(patch)
      return c.json(updated)
    },
  )

export default siteConfig
