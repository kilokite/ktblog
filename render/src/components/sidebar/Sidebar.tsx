import ProfileCard from './ProfileCard'
import NowPlayingCard from './NowPlayingCard'
import LinkCard from './LinkCard'
import './Sidebar.scss'

export default function Sidebar() {
  return (
    <aside class="sidebar">
      <ProfileCard />
      <NowPlayingCard />
      <LinkCard title="美少女万华镜" description="你所热爱的就是你的生活" />
    </aside>
  )
}
