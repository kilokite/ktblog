/* @refresh reload */
import './index.css'
import { hydrate, render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { ApiProvider } from './lib/api'
import App from './App'
import { Routes } from './routes'

const root = document.getElementById('root')!

const app = () => (
  <ApiProvider>
    <Router root={App}>
      <Routes />
    </Router>
  </ApiProvider>
)

if (root.childNodes.length > 0) {
  hydrate(app, root)
} else {
  render(app, root)
}
