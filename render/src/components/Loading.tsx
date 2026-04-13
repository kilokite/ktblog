import { For, Match, Switch } from 'solid-js'
import './Loading.scss'

function ListSkeleton() {
  return (
    <For each={[0, 1, 2]}>
      {() => (
        <div class="sk-card">
          <div class="sk-card-body">
            <div class="sk-card-meta">
              <div class="sk sk-card-tag" />
              <div class="sk sk-card-date" />
            </div>
            <div class="sk sk-card-title" />
            <div class="sk sk-card-summary" />
            <div class="sk sk-card-summary" />
          </div>
          <div class="sk sk-card-cover" />
        </div>
      )}
    </For>
  )
}

function DetailSkeleton() {
  return (
    <section class="detail-grid">
      <div class="sk-detail">
        <div class="sk-detail-header">
          <div class="sk-detail-meta">
            <div class="sk sk-detail-meta-item" />
            <div class="sk sk-detail-meta-item" />
            <div class="sk sk-detail-meta-item" />
          </div>
          <div class="sk sk-detail-title" />
        </div>
        <div class="sk sk-detail-cover" />
        <div class="sk-detail-body">
          <div class="sk sk-detail-line" />
          <div class="sk sk-detail-line" />
          <div class="sk sk-detail-line" />
          <div class="sk sk-detail-line" />
          <div class="sk sk-detail-line" />
          <div class="sk sk-detail-line" />
        </div>
      </div>
    </section>
  )
}

function ArchiveSkeleton() {
  return (
    <div class="sk-archive">
      <div class="sk sk-archive-title" />
      <div class="sk sk-archive-count" />

      <For each={[0, 1]}>
        {() => (
          <div class="sk-archive-group">
            <div class="sk sk-archive-year" />
            <For each={[0, 1, 2, 3]}>
              {() => (
                <div class="sk-archive-row">
                  <div class="sk sk-archive-row-date" />
                  <div class="sk sk-archive-row-title" />
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}

export default function Loading(props: {
  variant?: 'list' | 'detail' | 'archive'
}) {
  return (
    <Switch fallback={<ListSkeleton />}>
      <Match when={props.variant === 'detail'}>
        <DetailSkeleton />
      </Match>
      <Match when={props.variant === 'archive'}>
        <ArchiveSkeleton />
      </Match>
    </Switch>
  )
}
