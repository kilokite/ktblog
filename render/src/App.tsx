import type { RouteSectionProps } from '@solidjs/router'
import { A } from '@solidjs/router'
import './App.css'

export default function App(props: RouteSectionProps) {
  return (
    <>
      <header class="site-header">
        <A href="/" class="site-title">Blog</A>
      </header>
      <main class="site-main">{props.children}</main>
    </>
  )
}
