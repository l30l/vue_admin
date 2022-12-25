<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" @scroll="handleScroll">
      <router-link
        ref="tag"
        v-for="item in visitedViews"
        :key="item.path"
        :to="item.path"
        class="tag-item"
        :class="isActive(item) ? 'active' : ''"
        @contextmenu.prevent.native="openMenu(item, $event)"
      >
        <!-- <span>{{ item.title }}</span> -->
        {{ item.title }}
        <span
          v-if="!isAffix(item)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(item)"
        />
      </router-link>
    </scroll-pane>

    <ul v-show="isVisible" class="contextmenu" :style="{ top: top + 'px', left: left + 'px' }">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOtherTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'

import ScrollPane from './ScrollPane.vue'

export default {
  name: 'TagsView',
  components: { ScrollPane },
  computed: {
    ...mapGetters({
      routes: 'permission_routes',
      visitedViews: 'visitedViews'
    })
  },
  mounted() {
    this.initTags()
    this.addTag()
  },
  data() {
    return {
      isVisible: false,
      selectedTag: {},
      top: 0,
      left: 0
    }
  },
  watch: {
    $route(newVal) {
      if (newVal) {
        this.addTag()
      }
    },
    isVisible(newVal) {
      if (newVal) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },

  methods: {
    isActive(tag) {
      return tag.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixedTags(routes, basePath = '/') {
      let tags = []

      for (const route of routes) {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }

        if (route.children) {
          const temp = this.filterAffixedTags(route.children, route.path)
          if (temp.length >= 1) {
            tags = [...tags, ...temp]
          }
        }
      }

      return tags
    },
    initTags() {
      const affixedTags = this.filterAffixedTags(this.routes)
      for (const tag of affixedTags) {
        if (tag.name) {
          this.$store.dispatch('addVisitedView', tag)
        }
      }
    },
    addTag() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)

            if (tag.to.path !== this.$route.fullPath) {
              this.$store.dispatch('updateVisitedViews', this.$route)
            }
            break
          }
        }
      })
    },

    closeSelectedTag(view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },

    toLastView(visitedViews, view) {
      // if (visitedViews.length >= 1) {
      //   this.$router.push(visitedViews[visitedViews.length - 1].path) // close icon 的 <span /> click 事件要加上修饰符 .prevent
      // }
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        if (view.name === 'Dashboard') {
          this.$router.replace({
            path: '/redirect' + view.fullPath
          })
        } else {
          this.$router.push('/')
        }
      }
    },

    openMenu(item, e) {
      const menuMinWidth = 105 // 菜单最小宽度
      const offsetLeft = this.$el.getBoundingClientRect().left // TagsView 组件容器相对 viewport 左侧的距离，会根据 Sidebar 展开折叠而变化
      const offsetWidth = this.$el.offsetWidth // TagsView 组件容器宽度，会根据 Sidebar 展开折叠而变化
      const maxLeft = offsetWidth - menuMinWidth
      const left = e.clientX - offsetLeft + 15 // 15: 右键菜单距离鼠标点击点

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY

      this.isVisible = true
      this.selectedTag = item
    },
    closeMenu() {
      this.isVisible = false
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + view.fullPath
          })
        })
      })
    },
    closeOtherTags() {
      // this.$router.push(this.selectedTag.fullPath)
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOtherViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('delAllViews', view).then(({ visitedViews }) => {
        if (!this.isAffix(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="less" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tag-item {
    display: inline-block;
    height: 26px;
    margin-top: 4px;
    margin-left: 5px;
    padding: 0 8px;
    border: 1px solid #d8dce5;
    background: #fff;
    line-height: 26px;
    font-size: 12px;
    color: #495060;
    cursor: pointer;

    &:first-of-type {
      margin-left: 15px;
    }
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        display: inline-block;
        margin-right: 2px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fff;
      }
    }
  }
}
.contextmenu {
  position: absolute;
  z-index: 999;
  margin: 0;
  padding: 5px 0;
  list-style-type: none;
  background: #fff;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>

<style lang="less">
.tags-view-container {
  .tag-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
