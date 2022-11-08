<template>
  <div class="header-search" :class="{ show: isShow }">
    <svg-icon class="search-icon" icon-class="search" @click.stop="queryClick"></svg-icon>

    <!-- default-first-option:在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用 -->
    <el-select
      ref="headerSearch"
      class="header-search-select"
      v-model="query"
      multiple
      filterable
      remote
      default-first-option
      placeholder="Search"
      :remote-method="querySearch"
      @change="change"
    >
      <!-- label 是选项展示名，value 是可获取的选项值 -->
      <el-option
        v-for="item in options"
        :key="item.item.path"
        :label="item.item.title.join(' > ')"
        :value="item.item.path"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import path from 'path'

export default {
  name: 'Search',
  data() {
    return {
      isShow: false,
      query: '',
      options: [],
      searchPool: [],
      fuse: null
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        // 点击页面任意空白区域，搜索框关闭
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    },
    searchPool(newList) {
      this.fuseInit(newList)
    }
  },
  methods: {
    queryClick() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.$refs.headerSearch && this.$refs.headerSearch.focus()
      }
    },
    close() {
      this.$refs.headerSearch && this.$refs.headerSearch.blur()
      this.query = ''
      this.options = []
      this.isShow = false
    },
    change(item) {
      this.$router.push(item[0])
      this.$refs.headerSearch && this.$refs.headerSearch.blur()

      this.query = ''
      this.options = []

      // this.$nextTick(() => {
      //   this.isShow = false
      // })
    },
    // 生成可以在侧边栏中显示的路由列表用于搜索
    generateRoutes(routes, basePath = '/', parentTitle = []) {
      let res = []

      for (const item of routes) {
        if (item.hidden) {
          continue // 跳过不显示的路由，如登陆页面
        }

        const data = {
          // path.resolve()方法可以将多个路径解析为一个规范化的绝对路径。
          // 其处理方式类似于对这些路径逐一进行cd操作。
          // 与cd操作不同的是，这引起路径可以是文件，并且可不必实际存在
          // resolve()方法不会利用底层的文件系统判断路径是否存在，而只是进行路径字符串操作
          path: path.resolve(basePath, item.path),
          title: [...parentTitle]
        }

        if (item.meta && item.meta.title) {
          data.title = [...data.title, item.meta.title]
          // 排除不跳转的路由
          if (item.redirect !== 'noRedirect') {
            res.push(data)
          }
        }

        if (item.children) {
          const temp = this.generateRoutes(item.children, data.path, data.title)
          if (temp.length >= 1) {
            res = res.concat(temp)
          }
        }
      }

      return res
    },
    fuseInit(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true, // 是否按分数对结果列表排序
        threshold: 0.4, // 匹配算法阈值。阈值为0.0需要完全匹配（字母和位置），阈值为1.0将匹配任何内容。
        location: 0, // 确定文本中预期找到的模式的大致位置。
        /**
         * 确定匹配与模糊位置（由位置指定）的距离。一个精确的字母匹配，即距离模糊位置很远的字符将被视为完全不匹配。
         *  距离为0要求匹配位于指定的准确位置（exact location），距离为1000则要求完全匹配位于使用阈值0.8找到的位置的800个字符以内。
         */
        distance: 100,
        maxPatternLength: 32, // 模式的最大长度
        minMatchCharLength: 1, // 模式的最小字符长度
        keys: [
          {
            name: 'title',
            weight: 0.7 // weight 越大，该 key 的相关分数（relevance score）越高
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]
      })
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
        console.log(this.options)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
    margin-right: 0 !important;
  }

  .header-search-select {
    display: inline-block;
    overflow: hidden; // 隐藏 input，el-input__inner
    vertical-align: middle;
    width: 0;
    transition: width 0.2s;
    font-size: 18px;
    border-radius: 0;
    background: transparent;
  }
  ::v-deep .el-input__inner {
    border-radius: 0;
    border: 0;
    padding-left: 0;
    padding-right: 0;
    box-shadow: none !important;
    border-bottom: 1px solid #d9d9d9 !important;
    vertical-align: middle;
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
