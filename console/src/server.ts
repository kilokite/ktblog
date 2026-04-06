import { hc } from 'hono/client'
import type { ApiType } from '@server/routes'
import { useMainStore } from './store/mainStore'

let baseUrl: string
if (import.meta.env.DEV) {
  baseUrl = 'http://localhost:3000/api'
} else {
  baseUrl = `${window.location.origin}/api`
}

export const api = hc<ApiType>(baseUrl, {
  fetch: (input, init) => {
    const store = useMainStore()
    const headers = new Headers(init?.headers)
    if (store.token) headers.set('Authorization', `Bearer ${store.token}`)
    return fetch(input, { ...init, headers })
  }
})
