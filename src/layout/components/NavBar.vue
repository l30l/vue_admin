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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'

export default {
  components: { Breadcrumb, Hamburger, Search },
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
  }
}
</style>
