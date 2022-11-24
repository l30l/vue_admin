<template>
  <el-dropdown trigger="click" @command="handleSizeChange">
    <div>
      <svg-icon icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="size in sizeOptions"
        :key="size.value"
        :command="size.value"
        :disabled="currentSize === size.value"
      >
        {{ size.label }}</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SizeSelect',
  data() {
    return {
      sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
      ]
    }
  },
  computed: {
    currentSize() {
      return this.$store.getters.size
    }
  },
  methods: {
    handleSizeChange(size) {
      this.$ELEMENT.size = size // Element-UI 向 Vue 暴露的实例属性
      this.$store.dispatch('setSize', size)
      this.refreshView() // 使修改在当前页面及时生效
      this.$message({
        message: 'Switch Size Success',
        type: 'success'
      })
    },
    refreshView() {
      this.$store.dispatch('delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      // 使用 nextTick 是为了确保上面 dispatch 中 promise 异步清除的任务完成
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })

      // console.log(this.$route)
    }
  }
}
</script>

<style></style>
