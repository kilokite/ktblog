import { Show } from 'solid-js'
import { A } from '@solidjs/router'
import { fmtDate } from '../lib/utils'
import './PostCard.scss'

export type PostCardData = {
  slug: string
  title: string
  summary?: string | null
  coverUrl?: string | null
  publishedAt?: string | null
  createdAt: string
  category?: { name: string } | null
  tags?: { tag: { name: string } }[]
}

export default function PostCard(props: { post: PostCardData }) {
  return (
    <A href={`/post/${props.post.slug}`} class="post-card">
      <div class="post-card-body">
        <div class="post-card-meta">
          <Show when={props.post.tags?.[0]}>
            {(t) => <span class="post-tag">#{t().tag.name}</span>}
          </Show>
          <Show when={!props.post.tags?.[0] && props.post.category}>
            {(cat) => <span class="post-category">#{cat().name}</span>}
          </Show>
          <span class="post-date">
            {fmtDate(props.post.publishedAt ?? props.post.createdAt)}
          </span>
        </div>
        <h2 class="post-card-title">{props.post.title}</h2>
        <Show when={props.post.summary}>
          <p class="post-card-summary">{props.post.summary}</p>
        </Show>
      </div>
      <Show when={props.post.coverUrl}>
        {(url) => (
          <div class="post-card-cover">
            <img src={url()} alt="" />
          </div>
        )}
      </Show>
    </A>
  )
}
