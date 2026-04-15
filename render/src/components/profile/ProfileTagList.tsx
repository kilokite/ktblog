import { For } from 'solid-js'
import type { ProfileTag } from '@server/lib/site-config-schema'
import './ProfileTagList.scss'

function Tag(props: { tag: ProfileTag }) {
  return (
    <div class="profile-tag">
      <span class="profile-tag-symbol" style={{ color: props.tag.color }}>
        {props.tag.symbol}
      </span>
      <span class="profile-tag-text" style={{ color: props.tag.color }}>
        {props.tag.text}
      </span>
    </div>
  )
}

export default function ProfileTagList(props: { tags: ProfileTag[] }) {
  return (
    <div class="profile-tag-list">
      <For each={props.tags}>
        {(tag) => <Tag tag={tag} />}
      </For>
    </div>
  )
}
