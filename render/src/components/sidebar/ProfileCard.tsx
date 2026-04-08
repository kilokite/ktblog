import { AVATAR_IMG } from '../../lib/constants'
import './ProfileCard.scss'

export default function ProfileCard() {
  return (
    <div class="profile-card">
      <div class="profile-header">
        <img class="profile-avatar" src={AVATAR_IMG} alt="avatar" />
        <div class="profile-info">
          <span class="profile-name">Kilokite</span>
          <span class="profile-bio">想吃人想吃人想吃人想吃人想吃</span>
        </div>
      </div>
      <div class="profile-social">
        {/* <img src={IMG} alt="social links" /> */}
      </div>
    </div>
  )
}
