import { useSiteConfig } from '../../lib/site-config'
import './NowPlayingCard.scss'

export default function NowPlayingCard() {
  const siteConfig = useSiteConfig()

  return (
    <div class="now-playing-card">
      <img class="now-playing-bg" src={siteConfig().avatarUrl} alt="" />
      <span class="now-playing-label">{siteConfig().renderUi.sidebar.nowPlayingLabel}</span>
      <div class="now-playing-controls">
        <svg viewBox="0 0 10 12" width="10" height="12" fill="currentColor">
          <rect x="0" y="2" width="2" height="8" />
          <rect x="4" y="0" width="2" height="12" />
          <rect x="8" y="2" width="2" height="8" />
        </svg>
      </div>
    </div>
  )
}
