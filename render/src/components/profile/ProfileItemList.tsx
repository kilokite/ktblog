import { For } from 'solid-js'
import type { ProfileItem } from '@server/lib/site-config-schema'
import './ProfileItemList.scss'

function Item(props: { item: ProfileItem }) {
  return (
    <a
      class="profile-item-card"
      href={props.item.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="profile-item-icon" style={{ 'background-color': props.item.color }}>
        <span>{props.item.symbol}</span>
      </div>
      <h2 class="profile-item-title">{props.item.title}</h2>
      <div class="profile-item-desc">{props.item.description}</div>
    </a>
  )
}

export default function ProfileItemList(props: { items: ProfileItem[] }) {
  return (
    <div class="profile-item-list">
      <For each={props.items}>
        {(item) => <Item item={item} />}
      </For>
    </div>
  )
}
