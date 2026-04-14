import { createResource, For, Suspense } from 'solid-js'
import { useApi } from '../lib/api'
import { useSiteConfig } from '../lib/site-config'
import PostCard from '../components/PostCard'
import Loading from '../components/Loading'
import Sidebar from '../components/sidebar/Sidebar'
import './PostList.scss'

export default function PostList() {
  const api = useApi()
  const siteConfig = useSiteConfig()
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
            <For each={data()?.posts} fallback={<p>{siteConfig().renderUi.messages.noPosts}</p>}>
              {(post) => <PostCard post={post} />}
            </For>
          </Suspense>
        </div>
        <Sidebar />
      </section>
    </>
  )
}
