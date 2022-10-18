const getters = {
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.accessibleRoutesList
}

export default getters
