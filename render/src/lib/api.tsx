import { createContext, useContext } from 'solid-js'
import type { JSX } from 'solid-js'
import { hc } from 'hono/client'
import type { ApiType } from '@server/routes'

type ApiClient = ReturnType<typeof hc<ApiType>>

const ApiContext = createContext<ApiClient>()

export function useApi() {
  const ctx = useContext(ApiContext)
  if (!ctx) throw new Error('Missing ApiProvider')
  return ctx
}

export function createApiClient(fetchFn?: typeof globalThis.fetch) {
  let baseUrl: string
  if (typeof window === 'undefined') {
    baseUrl = 'http://localhost/api'
  } else if (import.meta.env.DEV) {
    baseUrl = 'http://localhost:3000/api'
  } else {
    baseUrl = `${window.location.origin}/api`
  }
  return hc<ApiType>(baseUrl, fetchFn ? { fetch: fetchFn } : {})
}

export function ApiProvider(props: { fetch?: typeof globalThis.fetch; children: JSX.Element }) {
  const client = createApiClient(props.fetch)
  return <ApiContext.Provider value={client}>{props.children}</ApiContext.Provider>
}
