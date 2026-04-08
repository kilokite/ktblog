import { createResource, Show, Suspense } from 'solid-js'
import { useParams, A } from '@solidjs/router'
import { useApi } from '../lib/api'

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
      <header class="detail-header">
        <A href="/">Kilokite Blog</A>
      </header>
      <main class="detail-main">
        <Suspense fallback={<p class="loading">Loading…</p>}>
          <Show when={post()} fallback={<p>Post not found.</p>}>
            {(p) => (
              <article class="post-detail">
                <h1>{p().title}</h1>
                <div class="meta">
                  <span>{p().author?.displayName}</span>
                  <time>
                    {new Date(p().publishedAt ?? p().createdAt).toLocaleDateString()}
                  </time>
                </div>
                <div class="content" innerHTML={p().content} />
              </article>
            )}
          </Show>
        </Suspense>
      </main>
    </>
  )
}
