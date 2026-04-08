import type { RouteSectionProps } from '@solidjs/router'
import './App.css'

export default function App(props: RouteSectionProps) {
  return <>{props.children}</>
}
