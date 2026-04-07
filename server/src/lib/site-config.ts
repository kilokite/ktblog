import { z } from 'zod/v4'
import { prisma } from './prisma.js'

export const siteConfigSchema = z.object({
  siteName: z.string().default(''),
  siteSlug: z.string().default(''),
  nickname: z.string().default(''),
  avatarUrl: z.string().default(''),
  description: z.string().default(''),
  footerText: z.string().default(''),
  customHtml: z.string().default(''),
})

export type SiteConfig = z.infer<typeof siteConfigSchema>

export const siteConfigPatchSchema = siteConfigSchema.partial()

export async function getSiteConfig(): Promise<SiteConfig> {
  const row = await prisma.siteConfig.findFirst()
  return siteConfigSchema.parse(row?.data ?? {})
}

export async function updateSiteConfig(
  patch: Partial<SiteConfig>,
): Promise<SiteConfig> {
  const current = await getSiteConfig()
  const merged = { ...current, ...patch }
  const validated = siteConfigSchema.parse(merged)
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { data: validated },
    create: { id: 1, data: validated },
  })
  return validated
}
