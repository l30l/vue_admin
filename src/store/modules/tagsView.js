const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  DEL_ALL_CACHED_VIEWS(state) {
    state.cachedViews = []
  },
  DEL_ALL_VISITED_VIEWS(state) {
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
    state.visitedViews = affixTags
  }
}

const actions = {
  delAllViews({ commit, dispatch }, view) {
    return new Promise((resolve) => {
      dispatch('delAllCachedViews', view)
      dispatch('delAllVisitedViews', view)

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },

  delAllCachedViews({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  delAllVisitedViews({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  }
}

export default {
  state,
  mutations,
  actions
}
