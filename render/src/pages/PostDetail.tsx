import { createResource, For, Show, Suspense } from 'solid-js'
import { useParams } from '@solidjs/router'
import { useApi } from '../lib/api'
import { fmtDate } from '../lib/utils'
import Sidebar from '../components/sidebar/Sidebar'
import './PostDetail.scss'

export default function PostDetail() {
  const params = useParams<{ slug: string }>()
  const api = useApi()

  const [post] = createResource(
    () => params.slug,
    async (slug) => {
      const res = await api.posts[':slug'].$get({ param: { slug } })
      if (!res.ok) return null
      return res.json()
    },
  )

  return (
    <>
      <div class="detail-page">
        <Suspense fallback={<p class="loading">Loading…</p>}>
          <Show when={post()} fallback={<p class="loading">Post not found.</p>}>
            {(p) => {
              const data = p()
              const dateStr = fmtDate(data.publishedAt ?? data.createdAt)
              return (
                <section class="detail-grid">
                  <main class="detail-article">
                    <header class="article-header">
                      <div class="article-meta">
                        <Show when={data.category}>
                          {(cat) => <span class="article-category">#{cat().name}</span>}
                        </Show>
                        <Show when={data.tags?.length}>
                          <For each={data.tags}>
                            {(t) => <span class="article-tag">#{t.tag.name}</span>}
                          </For>
                        </Show>
                        <Show when={data.author}>
                        {(author) => (
                          <div class="article-author">
                            <span class="author-name">{author().displayName}</span>
                          </div>
                        )}
                      </Show>
                        <span class="article-date">{dateStr}</span>
                      </div>
                      <h1 class="article-title">{data.title}</h1>
                    </header>

                    <Show when={data.coverUrl}>
                      {(url) => (
                        <figure class="article-cover">
                          <img src={url()} alt="" />
                        </figure>
                      )}
                    </Show>

                    <div class="article-body" innerHTML={data.content} />
                  </main>

                  <Sidebar />
                </section>
              )
            }}
          </Show>
        </Suspense>
      </div>
    </>
  )
}
