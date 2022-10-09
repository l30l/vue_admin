import { constantRoutes, asyncRoutes } from '@/router/'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles) // 在嵌套的子路由中筛选出所有有权限访问的路由
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  accessibleAsyncRoutes: [],
  accessibleRoutesList: []
}
const mutations = {
  SET_ROUTES(state, routes) {
    state.accessibleAsyncRoutes = routes
    state.accessibleRoutesList = constantRoutes.concat(routes)
  }
}
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessibleRoutes
      if (roles.includes('admin')) {
        accessibleRoutes = asyncRoutes || []
      } else {
        accessibleRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessibleRoutes)
      resolve(accessibleRoutes)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
