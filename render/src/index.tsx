/* @refresh reload */
import './index.scss'
import { hydrate, render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { ApiProvider } from './lib/api'
import App from './App'
import { SiteConfigProvider } from './lib/site-config'
import { Routes } from './routes'

const root = document.getElementById('root')!

const app = () => (
  <ApiProvider>
    <SiteConfigProvider>
      <Router root={App}>
        <Routes />
      </Router>
    </SiteConfigProvider>
  </ApiProvider>
)

if (root.childNodes.length > 0) {
  hydrate(app, root)
} else {
  render(app, root)
}
