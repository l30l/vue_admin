<template>
  <div class="navbar">
    <hamburger
      class="hamburger-container"
      @toggleClick="toggleSidebar"
      :is-active="sidebar.opened"
    ></hamburger>
    <breadcrumb></breadcrumb>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: { Breadcrumb, Hamburger },
  name: 'NavBar',
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch('toggleSidebar')
    }
  }
}
</script>

<style lang="less" scoped>
.hamburger-container {
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
  float: left;
  height: 100%;
  line-height: 46px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
</style>
