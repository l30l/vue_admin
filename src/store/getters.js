const getters = {
  roles: (state) => state.user.roles,
  avatar: (state) => state.user.avatar,
  permission_routes: (state) => state.permission.accessibleRoutesList,
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device
}

export default getters
