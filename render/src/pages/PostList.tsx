import { createResource, For, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { useApi } from '../lib/api'

export default function PostList() {
  const api = useApi()
  const [data] = createResource(async () => {
    const res = await api.posts.$get()
    return res.json()
  })

  return (
    <Suspense fallback={<p class="loading">Loading…</p>}>
      <ul class="post-list">
        <For each={data()?.posts} fallback={<p>No posts yet.</p>}>
          {(post) => (
            <li class="post-item">
              <A href={`/post/${post.slug}`} class="post-link">
                <h2>{post.title}</h2>
                {post.summary && <p class="summary">{post.summary}</p>}
                <div class="meta">
                  <span>{post.author?.displayName}</span>
                  <time>
                    {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </A>
            </li>
          )}
        </For>
      </ul>
    </Suspense>
  )
}
