import { createResource, For, Suspense } from 'solid-js'
import { useApi } from '../lib/api'
import NavBar from '../components/NavBar'
import PostCard from '../components/PostCard'
import ProfileCard from '../components/ProfileCard'
import NowPlayingCard from '../components/NowPlayingCard'
import LinkCard from '../components/LinkCard'

const HERO_IMG =
  'https://monika.jkloli.net/image_bed/d033e22ae3-1774779242009-7b0a8797-79ef-4f15-b48d-81d50f77e28e.jpg'

export default function PostList() {
  const api = useApi()
  const [data] = createResource(async () => {
    const res = await api.posts.$get()
    return res.json()
  })

  return (
    <>
      <section class="hero">
        <img class="hero-bg" src={HERO_IMG} alt="" />
        <div class="hero-overlay">
          <NavBar />
          <div class="hero-title">
            <h1>Kilokite Blog</h1>
            <p>后来喝中药调好了</p>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <div class="posts-main">
          <Suspense fallback={<p class="loading">Loading…</p>}>
            <For each={data()?.posts} fallback={<p>No posts yet.</p>}>
              {(post) => <PostCard post={post} />}
            </For>
          </Suspense>
        </div>
        <aside class="sidebar">
          <ProfileCard />
          <NowPlayingCard />
          <LinkCard title="美少女万华镜" description="你所热爱的就是你的生活" />
        </aside>
      </section>
    </>
  )
}
