import { createResource, For, Show, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { useApi } from '../lib/api'
import { useSiteConfig } from '../lib/site-config'
import Loading from '../components/Loading'
import Sidebar from '../components/sidebar/Sidebar'
import './Archive.scss'

type ArchivePost = {
  slug: string
  title: string
  publishedAt?: string | null
  createdAt: string
  category?: { name: string } | null
}

type YearGroup = {
  year: number
  posts: ArchivePost[]
}

function groupByYear(posts: ArchivePost[]): YearGroup[] {
  const map = new Map<number, ArchivePost[]>()
  for (const p of posts) {
    const y = new Date(p.publishedAt ?? p.createdAt).getFullYear()
    if (!map.has(y)) map.set(y, [])
    map.get(y)!.push(p)
  }
  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }))
}

function fmtShort(raw: string) {
  const d = new Date(raw)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function ArchiveItem(props: { post: ArchivePost }) {
  return (
    <li class="archive-item">
      <span class="item-date">
        {fmtShort(props.post.publishedAt ?? props.post.createdAt)}
      </span>
      <A href={`/post/${props.post.slug}`} class="item-title">
        {props.post.title}
      </A>
      <Show when={props.post.category}>
        {(cat) => <span class="item-cat">{cat().name}</span>}
      </Show>
    </li>
  )
}

function YearSection(props: { group: YearGroup }) {
  return (
    <div class="archive-year">
      <div class="year-label">{props.group.year}</div>
      <ul class="year-posts">
        <For each={props.group.posts}>
          {(post) => <ArchiveItem post={post} />}
        </For>
      </ul>
    </div>
  )
}

function ArchiveList(props: { posts: ArchivePost[]; total: number }) {
  const siteConfig = useSiteConfig()
  const archiveConfig = () => siteConfig().renderUi.pages.archive
  const countText = () =>
    archiveConfig().countTemplate.replaceAll('{{count}}', String(props.total))

  return (
    <div class="archive-container">
      <header class="archive-header">
        <h1 class="archive-title">{archiveConfig().title}</h1>
        <p class="archive-count">{countText()}</p>
      </header>

      <div class="archive-list">
        <For each={groupByYear(props.posts)}>
          {(group) => <YearSection group={group} />}
        </For>
      </div>
    </div>
  )
}

export default function Archive() {
  const api = useApi()
  const [data] = createResource(async () => {
    const res = await api.posts.$get({ query: { size: '9999' } })
    if (!res.ok) return null
    return res.json()
  })

  return (
    <section class="archive-grid">
      <div class="archive-main">
        <Suspense fallback={<Loading variant="archive" />}>
          <Show when={data()}>
            {(d) => <ArchiveList posts={d().posts} total={d().total} />}
          </Show>
        </Suspense>
      </div>
      <Sidebar />
    </section>
  )
}
