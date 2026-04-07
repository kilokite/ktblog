const counters: Record<string, number> = {}
const sums: Record<string, number> = {}
const startedAt = Date.now()

export function inc(key: string) {
  counters[key] = (counters[key] ?? 0) + 1
}

export function add(key: string, value: number) {
  sums[key] = (sums[key] ?? 0) + value
}

export function snapshot() {
  const mem = process.memoryUsage()
  return {
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    memoryMB: +(mem.rss / 1024 / 1024).toFixed(1),
    avgRenderMs: counters['ssr_render']
      ? +(sums['ssr_render_ms'] / counters['ssr_render']).toFixed(1)
      : 0,
    counters: { ...counters },
  }
}
