import { z } from 'zod/v4'

const DEFAULT_HERO_BG =
  'https://monika.jkloli.net/image_bed/d033e22ae3-1761805189908-bd152bb8-5a30-4319-8b8c-cc6f068bd0f7.jpg?x-oss-process=image/format,webp'

const DEFAULT_AVATAR_URL =
  'https://monika.jkloli.net/image_bed/d033e22ae3-1774779242009-7b0a8797-79ef-4f15-b48d-81d50f77e28e.jpg'

export const siteLinkSchema = z.object({
  label: z.string().default(''),
  href: z.string().default(''),
})

export const featuredLinkSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
})

const DEFAULT_HERO = {
  title: 'Kilokite Blog',
  subtitle: '后来喝中药调好了',
  backgroundUrl: DEFAULT_HERO_BG,
  accentText: 'o',
  accentColor: '#ffea00',
}

const DEFAULT_NAV_LINKS = [
  { label: '首页', href: '/' },
  { label: '归档', href: '/archive' },
  { label: '友链', href: '/' },
  { label: '关于', href: '/' },
]

const DEFAULT_FOOTER_LINKS = [
  { label: '随便看看', href: '/' },
  { label: '站点地图', href: '/' },
  { label: '友情链接', href: '/' },
  { label: '归档', href: '/archive' },
]

const DEFAULT_FEATURED_LINK = {
  title: '美少女万华镜',
  description: '你所热爱的就是你的生活',
}

const DEFAULT_ARCHIVE_PAGE = {
  title: '归档',
  countTemplate: '共 {{count}} 篇文章',
}

const DEFAULT_MESSAGES = {
  noPosts: 'No posts yet.',
  postNotFound: 'Post not found.',
}

const DEFAULT_RENDER_UI = {
  hero: DEFAULT_HERO,
  nav: {
    brandLabel: 'Kilokite',
    links: DEFAULT_NAV_LINKS,
  },
  footer: {
    links: DEFAULT_FOOTER_LINKS,
  },
  sidebar: {
    nowPlayingLabel: 'Now Playing',
    featuredLink: DEFAULT_FEATURED_LINK,
  },
  pages: {
    archive: DEFAULT_ARCHIVE_PAGE,
  },
  messages: DEFAULT_MESSAGES,
}

export const renderUiSchema = z.object({
  hero: z.object({
    title: z.string().default('Kilokite Blog'),
    subtitle: z.string().default('后来喝中药调好了'),
    backgroundUrl: z.string().default(DEFAULT_HERO_BG),
    accentText: z.string().default('o'),
    accentColor: z.string().default('#ffea00'),
  }).default(DEFAULT_HERO),
  nav: z.object({
    brandLabel: z.string().default('Kilokite'),
    links: z.array(siteLinkSchema).default(DEFAULT_NAV_LINKS),
  }).default(DEFAULT_RENDER_UI.nav),
  footer: z.object({
    links: z.array(siteLinkSchema).default(DEFAULT_FOOTER_LINKS),
  }).default(DEFAULT_RENDER_UI.footer),
  sidebar: z.object({
    nowPlayingLabel: z.string().default('Now Playing'),
    featuredLink: featuredLinkSchema.default(DEFAULT_FEATURED_LINK),
  }).default(DEFAULT_RENDER_UI.sidebar),
  pages: z.object({
    archive: z.object({
      title: z.string().default('归档'),
      countTemplate: z.string().default('共 {{count}} 篇文章'),
    }).default(DEFAULT_ARCHIVE_PAGE),
  }).default(DEFAULT_RENDER_UI.pages),
  messages: z.object({
    noPosts: z.string().default('No posts yet.'),
    postNotFound: z.string().default('Post not found.'),
  }).default(DEFAULT_MESSAGES),
}).default(DEFAULT_RENDER_UI)

export const siteConfigSchema = z.object({
  siteName: z.string().default('Kilokite Blog'),
  nickname: z.string().default('Kilokite'),
  avatarUrl: z.string().default(DEFAULT_AVATAR_URL),
  description: z.string().default('想吃人想吃人想吃人想吃人想吃'),
  footerText: z.string().default(''),
  customHtml: z.string().default(''),
  renderUi: renderUiSchema,
})

export type SiteLink = z.infer<typeof siteLinkSchema>
export type FeaturedLink = z.infer<typeof featuredLinkSchema>
export type RenderUiConfig = z.infer<typeof renderUiSchema>
export type SiteConfig = z.infer<typeof siteConfigSchema>

export const defaultSiteConfig = siteConfigSchema.parse({})
