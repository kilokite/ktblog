import { createResource, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { useApi } from '../lib/api'
import { fmtDate } from '../lib/utils'
import type { PostCardData } from '../components/PostCard'
import Sidebar from '../components/sidebar/Sidebar'
import './Archive.scss'

type YearGroup = {
  year: number
  months: { month: number; posts: PostCardData[] }[]
}

function groupByYear(posts: PostCardData[]): YearGroup[] {
  const map = new Map<number, Map<number, PostCardData[]>>()

  for (const p of posts) {
    const d = new Date(p.publishedAt ?? p.createdAt)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    if (!map.has(y)) map.set(y, new Map())
    const months = map.get(y)!
    if (!months.has(m)) months.set(m, [])
    months.get(m)!.push(p)
  }

  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, posts]) => ({ month, posts })),
    }))
}

const MONTH_NAMES = [
  '', '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

export default function Archive() {
  const api = useApi()
  const [data] = createResource(async () => {
    const res = await api.posts.$get({ query: { size: '100' } })
    if (!res.ok) return null
    return res.json()
  })

  const groups = () => {
    const d = data()
    return d ? groupByYear(d.posts as PostCardData[]) : []
  }

  return (
    <div class="detail-page">
      <section class="detail-grid">
        <main class="archive-card">
          <header class="archive-header">
            <h1 class="archive-title">归档</h1>
            <Show when={data()}>
              <p class="archive-count">共 {data()!.total} 篇文章</p>
            </Show>
          </header>

          <div class="archive-body">
            <div class="archive-timeline">
              <For each={groups()}>
                {(yearGroup) => (
                  <div class="archive-year">
                    <h2 class="archive-year-title">{yearGroup.year}</h2>
                    <For each={yearGroup.months}>
                      {(monthGroup) => (
                        <div class="archive-month">
                          <h3 class="archive-month-title">{MONTH_NAMES[monthGroup.month]}</h3>
                          <ul class="archive-list">
                            <For each={monthGroup.posts}>
                              {(post) => (
                                <li class="archive-item">
                                  <span class="archive-item-date">
                                    {fmtDate(post.publishedAt ?? post.createdAt)}
                                  </span>
                                  <A href={`/post/${post.slug}`} class="archive-item-link">
                                    {post.title}
                                  </A>
                                </li>
                              )}
                            </For>
                          </ul>
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
          </div>
        </main>

        <Sidebar />
      </section>
    </div>
  )
}
