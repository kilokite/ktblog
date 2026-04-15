import { Route } from '@solidjs/router'
import { lazy } from 'solid-js'

const PostList = lazy(() => import('./pages/PostList'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const Archive = lazy(() => import('./pages/Archive'))
const Profile = lazy(() => import('./pages/Profile'))

export function Routes() {
  return (
    <>
      <Route path="/" component={PostList} />
      <Route path="/post/:slug" component={PostDetail} />
      <Route path="/archive" component={Archive} />
      <Route path="/profile" component={Profile} />
    </>
  )
}
