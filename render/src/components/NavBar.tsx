import { createSignal, onCleanup, onMount } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import './NavBar.scss'

const SCROLL_THRESHOLD = 8
const COMPACT_SCROLL_DELTA = 200

export default function NavBar() {
  const [scrolled, setScrolled] = createSignal(false)
  const [compact, setCompact] = createSignal(false)
  const location = useLocation()
  const isPostPage = () => location.pathname.startsWith('/post/')

  onMount(() => {
    let lastY = window.scrollY
    let downAccum = 0

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > SCROLL_THRESHOLD)

      if (isPostPage()) {
        const delta = y - lastY
        if (delta > 0) {
          downAccum += delta
          if (downAccum >= COMPACT_SCROLL_DELTA) setCompact(true)
        } else {
          downAccum = 0
          setCompact(false)
        }
      } else {
        setCompact(false)
      }

      lastY = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    onCleanup(() => window.removeEventListener('scroll', onScroll))
  })

  return (
    <nav classList={{ nav: true, 'nav--scrolled': scrolled(), 'nav--compact': compact() }}>
      <A href="/" class="nav-brand">
        <span class="brand-text">Kilokite</span>
      </A>
      <div class="nav-links">
        <A href="/" class="nav-link">首页</A>
        <A href="/archive" class="nav-link">归档</A>
        <A href="/" class="nav-link">友链</A>
        <A href="/" class="nav-link">关于</A>
      </div>
      <div class="nav-actions">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </div>
    </nav>
  )
}
