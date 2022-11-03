<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- TransitionGroup 是 Vue 的一个内置组件，用于对 v-for 列表中的元素或组件的插入、移除和顺序改变添加动画效果 -->
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
          class="no-direct"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null
    }
  },
  created() {
    this.getBreadcrumb()
  },
  watch: {
    $route(newRoute) {
      // 如果路由跳转到重定向页面，不更新面包屑
      if (newRoute.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
      const first = matched[0]
      if (!this.isDashboard(first)) {
        // this.levelList = [
        //   {
        //     path: 'dashboard',
        //     meta: { title: 'Dashboard' }
        //   }
        // ].concat(matched)
        matched = [
          {
            path: '/dashboard',
            meta: { title: 'Dashboard' }
          }
        ].concat(matched)
      }
      // this.levelList = matched
      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      // return route.meta.title.toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    handleLink(item) {
      if (item.redirect) {
        this.$router.push(item.redirect)
        return
      }
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="less" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .el-breadcrumb__item {
    display: flex;
  }

  .no-direct {
    color: #97a8be;
    cursor: text;
  }
}
</style>
