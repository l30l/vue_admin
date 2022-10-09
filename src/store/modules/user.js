import { login, getUserInfo } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  roles: [],
  introduction: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  SET_NAME(state, name) {
    state.name = name
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar
  },
  SET_INTRODUCTION(state, introduction) {
    state.introduction = introduction
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
  },
  getUserInfo({ state, commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token)
        .then((res) => {
          // console.log(res)
          const { data } = res
          if (!data) {
            reject(new Error('Verification failed, please login again.'))
          }
          const { roles, introduction, avatar, name } = data

          // 判断是否有 roles，以及 roles 必须为非空数组
          if (!roles || roles.length <= 0) {
            reject(new Error('getUserInfo: roles must be a non-null array!'))
          }

          commit('SET_ROLES', roles)
          commit('SET_INTRODUCTION', introduction)
          commit('SET_AVATAR', avatar)
          commit('SET_NAME', name)

          resolve(data)
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
