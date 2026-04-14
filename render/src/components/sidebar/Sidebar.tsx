import ProfileCard from './ProfileCard'
import NowPlayingCard from './NowPlayingCard'
import LinkCard from './LinkCard'
import { useSiteConfig } from '../../lib/site-config'
import './Sidebar.scss'

export default function Sidebar() {
  const siteConfig = useSiteConfig()

  return (
    <aside class="sidebar">
      <ProfileCard />
      <NowPlayingCard />
      <LinkCard
        title={siteConfig().renderUi.sidebar.featuredLink.title}
        description={siteConfig().renderUi.sidebar.featuredLink.description}
      />
    </aside>
  )
}
