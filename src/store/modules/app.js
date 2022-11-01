import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // Cookies.get 得到的是 String 类型（‘0’ 或 '1')
    // +Cookies.get 进行隐式类型转换，得到 Number 类型（0 或 1)
    // !+Cookies.get 得到 Number 对应 Boolean 的取反值 (true 或 false)
    // !!+Cookies.get 再次取反，得到数值对应的 Boolean (false 或 true)
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}
const mutations = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR(state, withoutAnimation) {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    Cookies.set('sidebarStatus', 0)
  },
  TOGGLE_DEVICE(state, device) {
    state.device = device
  }
}
const actions = {
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSidebar({ commit }, withoutAnimation) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  state,
  mutations,
  actions
}
