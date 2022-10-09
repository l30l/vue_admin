import router from './router/'
import store from './store'

import { Message } from 'element-ui'

import { getToken } from './utils/auth'

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  const token = getToken()

  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('getUserInfo')
          const accessibleRoutes = await store.dispatch('generateRoutes', roles)

          // for (let i = 0; i < accessibleRoutes.length; i++) {
          //   router.addRoute(accessibleRoutes[i])
          // }
          accessibleRoutes.forEach((item) => {
            router.addRoute(item)
          })

          next({ ...to, replace: true })
        } catch (err) {
          Message.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
