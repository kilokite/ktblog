import { createResource, For, Suspense } from 'solid-js'
import { useApi } from '../lib/api'
import { useLayoutConfig } from '../lib/layoutConfig'
import PostCard from '../components/PostCard'
import Loading from '../components/Loading'
import Sidebar from '../components/sidebar/Sidebar'
import './PostList.scss'

export default function PostList() {
  useLayoutConfig({ heroOverlap: 219, heroOverlapTablet: 160, heroOverlapMobile: 120 })

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
          <Suspense fallback={<Loading />}>
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
