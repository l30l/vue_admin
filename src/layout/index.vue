<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container"></sidebar>
    <div class="hasTagsView main-container">
      <div class="fixed-header">
        <nav-bar></nav-bar>
        <tags-view></tags-view>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ResizeMixin from './mixin/ResizeHandler'

import Sidebar from './components/Sidebar/index.vue'
import NavBar from './components/NavBar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    NavBar,
    TagsView,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSidebar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixin.less';
@import '@/assets/css/variables.module.less';

.app-wrapper {
  .clearfix;

  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #000;
  opacity: 0.25;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - @sideBarWidth);
  transition: width 0.28s;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.mobile .fixed-header {
  width: 100%;
}
</style>
