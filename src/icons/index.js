import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
function importAll(reqContext) {
  reqContext.keys().map(reqContext)
}
importAll(req)
