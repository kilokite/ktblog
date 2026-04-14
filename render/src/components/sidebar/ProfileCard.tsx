import { useSiteConfig } from '../../lib/site-config'
import './ProfileCard.scss'

export default function ProfileCard() {
  const siteConfig = useSiteConfig()

  return (
    <div class="profile-card">
      <div class="profile-header">
        <img class="profile-avatar" src={siteConfig().avatarUrl} alt={siteConfig().nickname} />
        <div class="profile-info">
          <span class="profile-name">{siteConfig().nickname}</span>
          <span class="profile-bio">{siteConfig().description}</span>
        </div>
      </div>
      <div class="profile-social">
        {/* <img src={IMG} alt="social links" /> */}
      </div>
    </div>
  )
}
