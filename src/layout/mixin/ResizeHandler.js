import store from '@/store'

const WIDTH = 992

export default {
  watch: {
    $route(newRoute) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.$store.dispatch('closeSidebar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event
    window.addEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('toggleDevice', 'mobile')
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  methods: {
    $_isMobile() {
      const rect = document.body.getBoundingClientRect() // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/hidden
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        const device = isMobile ? 'mobile' : 'desktop'
        store.dispatch('toggleDevice', device)

        if (isMobile) {
          store.dispatch('closeSidebar', { withoutAnimation: false })
        }
      }
    }
  }
}
