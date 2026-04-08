import { createResource, For, Suspense } from 'solid-js'
import { useApi } from '../lib/api'
import PostCard from '../components/PostCard'
import Sidebar from '../components/sidebar/Sidebar'
import './PostList.scss'

export default function PostList() {
  const api = useApi()
  const [data] = createResource(async () => {
    const res = await api.posts.$get()
    if (!res.ok) return null
    return res.json()
  })

  return (
    <>
      <section class="content-grid">
        <div class="posts-main">
          <Suspense fallback={<p class="loading">Loading…</p>}>
            <For each={data()?.posts} fallback={<p>No posts yet.</p>}>
              {(post) => <PostCard post={post} />}
            </For>
          </Suspense>
        </div>
        <Sidebar />
      </section>
    </>
  )
}
