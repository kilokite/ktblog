import { renderToStringAsync, generateHydrationScript } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { ApiProvider } from './lib/api'
import App from './App'
import { Routes } from './routes'

export async function solid_render(fetchFn: typeof globalThis.fetch, url: string) {
  return renderToStringAsync(() => (
    <ApiProvider fetch={fetchFn}>
      <Router url={url} root={App}>
        <Routes />
      </Router>
    </ApiProvider>
  ))
}

export { generateHydrationScript }
