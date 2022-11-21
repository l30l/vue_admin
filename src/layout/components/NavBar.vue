<template>
  <div class="navbar">
    <hamburger
      class="hamburger-container"
      @toggleClick="toggleSidebar"
      :is-active="sidebar.opened"
    ></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <search class="right-menu-item"></search>
      <screenfull class="right-menu-item hover-effect"></screenfull>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import Screenfull from '@/components/Screenfull'

export default {
  components: { Breadcrumb, Hamburger, Search, Screenfull },
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

.breadcrumb-container {
  float: left;
}

.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
}
</style>
