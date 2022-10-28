<template>
  <div class="sidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <!-- 解决菜单折叠时卡顿：设置 :collapse-transition="false",并在 css 样式中添加 transition -->
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :route-item="route"
          :base-path="route.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import variables from '@/assets/css/variables.module.less'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem.vue'

export default {
  components: { SidebarItem },
  name: 'Sidebar',

  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    variables() {
      return variables
    },
    activeMenu() {
      // return this.$route.path
      const route = this.$route
      const { meta, path } = route
      // 如果该路由设置了 activeMenu 属性，则会高亮相对应的侧边栏
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    openMenu() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style>
.el-menu--collapse {
  width: 64px;
}
</style>
