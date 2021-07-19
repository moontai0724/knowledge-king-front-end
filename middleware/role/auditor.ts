import { Middleware } from '@nuxt/types'
import { User } from '~/types/user.interface'

export const auditorPermissionMiddleware: Middleware = ({
  store,
  $auth,
  redirect,
}) => {
  const user = $auth.user as unknown as User
  if (user.permission < 2) {
    store.commit('message/set', '您沒有權限瀏覽該頁面。')
    redirect('/admin')
  }
}

export default auditorPermissionMiddleware
