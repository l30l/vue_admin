const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_CACHED_VIEW(state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  ADD_VISITED_VIEW(state, view) {
    if (state.visitedViews.some((v) => v.path === view.path)) return
    // state.visitedViews.push(view)

    // Object.assign()
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },

  DEL_CACHED_VIEW(state, view) {
    const index = state.cachedViews.indexOf(view.name)
    // 先判断要关闭的页面是否缓存了
    // 假如配置路由时设置了 noCache，那么 index = -1，会从 -1 + cachedViews.length 位置开始删除 1 个元素
    index > -1 && state.cachedViews.splice(index, 1)
  },
  DEL_VISITED_VIEW(state, view) {
    // const selectedView = state.visitedViews.filter((v) => v.path === view.path)[0]
    // const index = state.visitedViews.indexOf(selectedView)
    // console.log(index)

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
    for (const [index, element] of state.visitedViews.entries()) {
      if (element.path === view.path) {
        state.visitedViews.splice(index, 1)
        break
      }
    }
  },

  DEL_OTHER_CACHED_VIEWS(state, view) {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      state.cachedViews = []
    }
  },
  DEL_OTHER_VISITED_VIEWS(state, view) {
    // if (view.meta && view.meta.affix) {
    //   this.commit('DEL_ALL_VISITED_VIEWS')
    // } else {
    //   const tags = state.visitedViews.filter((v) => v.path === view.path)
    //   const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
    //   state.visitedViews = [...affixTags, ...tags]
    // }

    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path
    })
  },

  DEL_ALL_CACHED_VIEWS(state) {
    state.cachedViews = []
  },
  DEL_ALL_VISITED_VIEWS(state) {
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
    state.visitedViews = affixTags
  },
  UPDATE_VISITED_VIEWS(state, view) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },

  delView({ dispatch }, view) {
    return new Promise((resolve) => {
      dispatch('delCachedView', view)
      dispatch('delVisitedView', view)

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delVisitedView({ commit }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },

  delOtherViews({ dispatch }, view) {
    return new Promise((resolve) => {
      dispatch('delOtherCachedViews', view)
      dispatch('delOtherVisitedViews', view)

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOtherCachedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_OTHER_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  delOtherVisitedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_OTHER_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
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
  },
  updateVisitedViews({ commit }, view) {
    commit('UPDATE_VISITED_VIEWS', view)
  }
}

export default {
  state,
  mutations,
  actions
}
