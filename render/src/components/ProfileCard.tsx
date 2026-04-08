const IMG =
  'https://monika.jkloli.net/image_bed/d033e22ae3-1774779242009-7b0a8797-79ef-4f15-b48d-81d50f77e28e.jpg'

export default function ProfileCard() {
  return (
    <div class="profile-card">
      <div class="profile-header">
        <img class="profile-avatar" src={IMG} alt="avatar" />
        <div class="profile-info">
          <span class="profile-name">Kilokite</span>
          <span class="profile-bio">想吃人想吃人想吃人想吃人想吃</span>
        </div>
      </div>
      <div class="profile-social">
        <img src={IMG} alt="social links" />
      </div>
    </div>
  )
}
