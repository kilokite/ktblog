import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'
import api from './routes/index.js'
import { createRenderHandler, distDir } from './ssr.js'

const app = new Hono()

app.use('*', cors())

app.use('/assets/*', serveStatic({ root: distDir }))
app.use('/favicon.svg', serveStatic({ root: distDir }))
app.use('/icons.svg', serveStatic({ root: distDir }))

app.route('/api', api)

app.get('*', createRenderHandler(app))

export default app
