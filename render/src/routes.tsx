import { Route } from '@solidjs/router'
import { lazy } from 'solid-js'

const PostList = lazy(() => import('./pages/PostList'))
const PostDetail = lazy(() => import('./pages/PostDetail'))

export function Routes() {
  return (
    <>
      <Route path="/" component={PostList} />
      <Route path="/post/:slug" component={PostDetail} />
    </>
  )
}
