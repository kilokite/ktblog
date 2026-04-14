import { prisma } from './prisma.js'
import {
  siteConfigSchema,
  type SiteConfig,
} from './site-config-schema.js'

export const siteConfigPatchSchema = siteConfigSchema.partial()

export async function getSiteConfig(): Promise<SiteConfig> {
  const row = await prisma.siteConfig.findFirst()
  return siteConfigSchema.parse(row?.data ?? {})
}

export async function updateSiteConfig(
  patch: Partial<SiteConfig>,
): Promise<SiteConfig> {
  const current = await getSiteConfig()
  // 这里只做浅合并，嵌套对象（例如 renderUi）会被整体替换。
  // 调用方应尽量传入完整对象，避免丢失嵌套字段。
  const merged = { ...current, ...patch }
  const validated = siteConfigSchema.parse(merged)
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { data: validated },
    create: { id: 1, data: validated },
  })
  return validated
}
