import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
import enLang from 'element-ui/lib/locale/lang/en'

import '@/assets/css/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

import '../mock/'
import './icons/'
import './permission'

// import '../mock/'
// if (process.env.NODE_ENV === 'development') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium',
  locale: enLang
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
