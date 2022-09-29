import { login } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken()
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  }
}

const actions = {
  login({ commit }, loginForm) {
    const { username, password } = loginForm
    return new Promise((resolve, reject) => {
      login({ username, password })
        .then(({ data }) => {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
