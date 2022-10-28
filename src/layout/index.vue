<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <nav-bar></nav-bar>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Sidebar from './components/Sidebar/index.vue'
import NavBar from './components/NavBar.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    NavBar
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened
      }
    }
  }
}
</script>

<style></style>
