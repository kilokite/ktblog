import './ProfileSectionTitle.scss'

export default function ProfileSectionTitle(props: { text: string }) {
  return (
    <div class="profile-section-title">{props.text}</div>
  )
}
