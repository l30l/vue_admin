<template>
  <div v-if="!routeItem.hidden">
    <!-- 将路由渲染成 Sidebar 中单独一项需满足以下三个条件： -->
    <!-- 1. 该路由没有子路由，或只有一条子路由 -->
    <!-- 2. 只有一条子路由 onlyOneChild，且该路由没有设置 alwaysShow，则只渲染子路由 -->
    <!-- 3. 只有一条子路由 onlyOneChild，子路由中没有嵌套子路由 -->
    <template
      v-if="
        hasOneShowingChild(routeItem.children, routeItem) &&
        !routeItem.alwaysShow &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title"></item>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(routeItem.path)">
      <template slot="title">
        <item
          v-if="routeItem.meta"
          :icon="routeItem.meta && routeItem.meta.icon"
          :title="routeItem.meta.title"
        ></item>
      </template>
      <sidebar-item
        class="nest-menu"
        v-for="child in routeItem.children"
        :key="child.path"
        :route-item="child"
        :base-path="resolvePath(child.path)"
        :is-nest="true"
      ></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'

import Item from './Item.vue'
import AppLink from './Link.vue'

export default {
  components: { Item, AppLink },
  name: 'SidebarItem',
  props: {
    routeItem: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      // 当前路由只有一条子路由，Sidebar 直接展示该子路由
      if (showingChildren.length === 1) {
        return true
      }

      // 当前路由没有子路由，直接展示在 Sidebar 中
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false // 当前路由的子路由 > 1，在 Sidebar 中以嵌套形式 <el-submenu />展示
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }

      return path.resolve(this.basePath, routePath)
    }
  }
}

// 这个组件中有两个值得注意的点：

// 1. 使用了递归组件。element-ui 中提供了两种形式的侧边栏 item 项：
// 第一种是<el-menu-item />，是一个直接的链接；
// 第二种是<el-submenu />，是嵌套菜单，嵌套<el-menu-item /> 或 <el-submenu />。
// 本项目中，侧边栏通过读取路由，并判断权限动态生成。
// 渲染哪种 item 项取决于当前路由是否有嵌套子路由。
// 动态渲染子路由时同样依靠这套逻辑判断渲染哪种 item 项，此时可以使用递归组件。

// 2. 对数据的处理。这里不是处理需要展示的数据，而是路由。
// 需要注意的是可以直接获取到的数据，与目标数据间的差别，
// 通过各种方式（类型转换、拼接、截取等方法）转换成目标数据。
</script>
