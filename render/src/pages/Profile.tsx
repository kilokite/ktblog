import { For, Switch, Match } from 'solid-js'
import { useSiteConfig } from '../lib/site-config'
import type { ProfileContentBlock } from '@server/lib/site-config-schema'
import ProfileItemList from '../components/profile/ProfileItemList'
import ProfileTagList from '../components/profile/ProfileTagList'
import ProfileSectionTitle from '../components/profile/ProfileSectionTitle'
import './Profile.scss'

function ContentBlock(props: { block: ProfileContentBlock }) {
  return (
    <Switch>
      <Match when={props.block.type === 'item-list' && props.block}>
        {(b) => {
          const block = b() as Extract<ProfileContentBlock, { type: 'item-list' }>
          return <ProfileItemList items={block.items} />
        }}
      </Match>
      <Match when={props.block.type === 'tag-list' && props.block}>
        {(b) => {
          const block = b() as Extract<ProfileContentBlock, { type: 'tag-list' }>
          return <ProfileTagList tags={block.tags} />
        }}
      </Match>
      <Match when={props.block.type === 'title' && props.block}>
        {(b) => {
          const block = b() as Extract<ProfileContentBlock, { type: 'title' }>
          return <ProfileSectionTitle text={block.text} />
        }}
      </Match>
    </Switch>
  )
}

export default function Profile() {
  const siteConfig = useSiteConfig()

  return (
    <div class="profile-page">
      <div class="profile-layout">
        <div class="profile-info">
          <div
            class="profile-info-avatar"
            style={{ 'background-image': `url(${siteConfig().avatarUrl})` }}
          />
          <h1 class="profile-info-name">{siteConfig().nickname}</h1>
          <div class="profile-info-desc">{siteConfig().description}</div>
        </div>
        <div class="profile-content">
          <For each={siteConfig().renderUi.pages.profile.content}>
            {(block) => <ContentBlock block={block} />}
          </For>
        </div>
      </div>
    </div>
  )
}
