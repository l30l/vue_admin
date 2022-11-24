const getters = {
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.accessibleRoutesList,
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size
}

export default getters
