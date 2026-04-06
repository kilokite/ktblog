import fs from 'node:fs'
import path from 'node:path'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { solid_render, generateHydrationScript } from '@ktblog/render/server'
import api from './routes/index.js'

const distDir = path.resolve(import.meta.dirname, '../../render/dist')
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

const app = new Hono()

app.use('*', cors())

app.use('/assets/*', serveStatic({ root: distDir }))
app.use('/favicon.svg', serveStatic({ root: distDir }))
app.use('/icons.svg', serveStatic({ root: distDir }))

app.route('/api', api)

app.get('/', async (c) => {
  const renderStart = performance.now()
  const ssrHtml = await solid_render(
    (input, init) => Promise.resolve(app.request(input as string, init))
  )
  console.log(`render${c.req.url}: ${(performance.now() - renderStart).toFixed(2)}ms`)
  const page = template
    .replace('</head>', `${generateHydrationScript()}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`)
  return c.html(page)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
