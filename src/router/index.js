import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
    {
      path: '/index',
      name: '首页',
      component: () => import('@/components/Index'),
      children: [
        {
          path: '/im',
          index: 1,
          name: '聊天',
          component: () => import('@/components/Main/im.vue')
        }
      ]
     }, {
        path: '/',
        component: () => import('@/components/Login'),
        hidden: true
    }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()


export default router