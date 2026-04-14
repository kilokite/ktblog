import {
  createContext,
  createResource,
  useContext,
  type Accessor,
  type JSX,
} from 'solid-js'
import type { SiteConfig } from '@server/lib/site-config-schema'
import { useApi } from './api'

function createEmptySiteConfig(): SiteConfig {
  return {
    siteName: '',
    nickname: '',
    avatarUrl: '',
    description: '',
    footerText: '',
    customHtml: '',
    renderUi: {
      hero: { title: '', subtitle: '', backgroundUrl: '', accentText: '', accentColor: '' },
      nav: { brandLabel: '', links: [] },
      footer: { links: [] },
      sidebar: { nowPlayingLabel: '', featuredLink: { title: '', description: '' } },
      pages: { archive: { title: '', countTemplate: '' } },
      messages: { noPosts: '', postNotFound: '' },
    },
  }
}

const SiteConfigContext = createContext<Accessor<SiteConfig>>()

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('Missing SiteConfigProvider')
  return ctx
}

export function SiteConfigProvider(props: {
  initialConfig?: SiteConfig
  children: JSX.Element
}) {
  const api = useApi()
  const empty = createEmptySiteConfig()
  // SSR：服务端会传入 initialConfig，这里直接使用，不会发起网络请求。
  // CSR hydrate：initialConfig 为空，组件挂载后会请求一次 /site-config。
  const [siteConfig] = createResource(
    async () => {
      if (typeof window === 'undefined' && props.initialConfig) {
        return props.initialConfig
      }
      const res = await api['site-config'].$get()
      if (!res.ok) return props.initialConfig ?? empty
      return res.json()
    },
    { initialValue: props.initialConfig ?? empty },
  )

  return (
    <SiteConfigContext.Provider value={siteConfig}>
      {props.children}
    </SiteConfigContext.Provider>
  )
}
