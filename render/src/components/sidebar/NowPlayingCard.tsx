import { AVATAR_IMG } from '../../lib/constants'
import './NowPlayingCard.scss'

export default function NowPlayingCard() {
  return (
    <div class="now-playing-card">
      <img class="now-playing-bg" src={AVATAR_IMG} alt="" />
      <span class="now-playing-label">Now Playing</span>
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
