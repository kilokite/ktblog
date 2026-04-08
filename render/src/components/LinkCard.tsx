export default function LinkCard(props: {
  title: string
  description: string
  color?: string
}) {
  return (
    <div class="link-card" style={{ background: props.color ?? '#FF6699' }}>
      <div class="link-card-icon">
        <svg viewBox="0 0 20 16" width="20" height="16" fill="currentColor">
          <path d="M2 0C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8L8 0H2z" />
        </svg>
      </div>
      <div class="link-card-content">
        <span class="link-card-title">{props.title}</span>
        <span class="link-card-desc">{props.description}</span>
      </div>
    </div>
  )
}
