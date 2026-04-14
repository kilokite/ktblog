import fs from 'node:fs'
import path from 'node:path'
import type { Hono } from 'hono'
import type { Context } from 'hono'
import { solid_render, generateHydrationScript } from '@ktblog/render/server'
import { getSiteConfig } from './lib/site-config.js'
import { inc, add } from './lib/stats.js'
import { escapeHtml } from './lib/utils.js'

const distDir = path.resolve(import.meta.dirname, '../../render/dist')
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

export function createRenderHandler(app: Hono) {
  return async (c: Context) => {
    const renderStart = performance.now()
    const url = new URL(c.req.url).pathname
    const siteConfig = await getSiteConfig()
    const ssrHtml = await solid_render(
      (input, init) => Promise.resolve(app.request(input as string, init)),
      url,
      siteConfig,
    )
    const elapsed = performance.now() - renderStart
    inc('ssr_render')
    add('ssr_render_ms', elapsed)
    console.log(`render${c.req.url}: ${elapsed.toFixed(2)}ms`)
    const page = template
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(siteConfig.siteName)}</title>`)
      .replace('</head>', `${generateHydrationScript()}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`)
    return c.html(page)
  }
}

export { distDir }
