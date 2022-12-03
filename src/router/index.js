import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout/index.vue'

Vue.use(VueRouter)
// 获取原型对象上的 push 函数
const originalPush = VueRouter.prototype.push
// 修改原型对象上的 push 函数
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch((err) => err)
}

export const constantRoutes = [
  {
    path: '/redirect/:path*', // 将匹配以 `/redirect/` 开头的所有内容，并将其放在 `$route.params.path` 下
    component: () => import('@/views/redirect/index.vue'),
    hidden: true
  },
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   name: 'redirect',
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true // 该路由不会在侧边栏显示
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard', // 一定要设定路由的 name，否则使用 <keep-alive> 时会出问题！！
        meta: {
          title: 'Dashboard', // 该路由在侧边栏和面包屑导航中展示的名称
          icon: 'dashboard', // 在侧边栏展示的图标
          affix: true // 会固定在 tags-view 中
        }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: {
          title: 'Documentation',
          icon: 'documentation',
          affix: true
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // 当路由只有一个子路由时，该子路由会作为根路由在侧边栏中展示，设置 always：true，可以将该根路由（而非其子路由）作为侧边栏的根路由展示
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admim']
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  }
]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes: constantRoutes
// })

const createRouter = () =>
  new VueRouter({
    mode: 'history',

    // https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
    // 切换到新路由时，页面滚动到顶部
    scrollBehavior: () => ({ y: 0 }),

    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
