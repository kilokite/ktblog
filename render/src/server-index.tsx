import { renderToStringAsync, generateHydrationScript } from 'solid-js/web'
import { Router } from '@solidjs/router'
import type { SiteConfig } from '@server/lib/site-config-schema'
import { ApiProvider } from './lib/api'
import App from './App'
import { SiteConfigProvider } from './lib/site-config'
import { Routes } from './routes'

export async function solid_render(
  fetchFn: typeof globalThis.fetch,
  url: string,
  siteConfig?: SiteConfig,
) {
  return renderToStringAsync(() => (
    <ApiProvider fetch={fetchFn}>
      <SiteConfigProvider initialConfig={siteConfig}>
        <Router url={url} root={App}>
          <Routes />
        </Router>
      </SiteConfigProvider>
    </ApiProvider>
  ))
}

export { generateHydrationScript }
