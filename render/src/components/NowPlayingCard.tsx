const IMG =
  'https://monika.jkloli.net/image_bed/d033e22ae3-1774779242009-7b0a8797-79ef-4f15-b48d-81d50f77e28e.jpg'

export default function NowPlayingCard() {
  return (
    <div class="now-playing-card">
      <img class="now-playing-bg" src={IMG} alt="" />
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
