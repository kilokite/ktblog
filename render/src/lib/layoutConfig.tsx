import {
  createContext,
  useContext,
  createSignal,
  onMount,
  type ParentProps,
  type Accessor,
} from 'solid-js'
import { isServer } from 'solid-js/web'

export interface LayoutConfig {
  heroOverlap: number
  heroOverlapTablet?: number
  heroOverlapMobile?: number
}

const DEFAULTS: LayoutConfig = {
  heroOverlap: 219,
  heroOverlapTablet: 160,
  heroOverlapMobile: 120,
}

const HERO_HEIGHTS = { desktop: 635, tablet: 480, mobile: 380 }
const NAV_HEIGHT = 54

interface Resolved {
  overlap: number
  titleHeight: number
}

interface LayoutConfigCtx {
  overlap: Accessor<number>
  titleHeight: Accessor<number>
  setConfig: (cfg: Partial<LayoutConfig>) => void
}

const Ctx = createContext<LayoutConfigCtx>()

function resolve(cfg: LayoutConfig): Resolved {
  let heroH: number
  let overlap: number

  if (isServer) {
    heroH = HERO_HEIGHTS.desktop
    overlap = cfg.heroOverlap
  } else {
    const w = window.innerWidth
    if (w <= 640) {
      heroH = HERO_HEIGHTS.mobile
      overlap = cfg.heroOverlapMobile ?? cfg.heroOverlap
    } else if (w <= 1024) {
      heroH = HERO_HEIGHTS.tablet
      overlap = cfg.heroOverlapTablet ?? cfg.heroOverlap
    } else {
      heroH = HERO_HEIGHTS.desktop
      overlap = cfg.heroOverlap
    }
  }

  return { overlap, titleHeight: heroH - overlap - NAV_HEIGHT }
}

export function LayoutConfigProvider(props: ParentProps) {
  const [cfg, setCfg] = createSignal<LayoutConfig>({ ...DEFAULTS })

  const initial = resolve(DEFAULTS)
  const [overlap, setOverlap] = createSignal(initial.overlap)
  const [titleHeight, setTitleHeight] = createSignal(initial.titleHeight)

  const sync = (c: LayoutConfig) => {
    const r = resolve(c)
    setOverlap(r.overlap)
    setTitleHeight(r.titleHeight)
  }

  const setConfig = (partial: Partial<LayoutConfig>) => {
    const next = { ...DEFAULTS, ...partial }
    setCfg(next)
    sync(next)
  }

  if (!isServer) {
    const onResize = () => sync(cfg())
    window.addEventListener('resize', onResize)
  }

  return (
    <Ctx.Provider value={{ overlap, titleHeight, setConfig }}>
      {props.children}
    </Ctx.Provider>
  )
}

export function useLayoutConfig(pageConfig?: Partial<LayoutConfig>) {
  const ctx = useContext(Ctx)!
  if (pageConfig) {
    onMount(() => ctx.setConfig(pageConfig))
  }
  return ctx
}
