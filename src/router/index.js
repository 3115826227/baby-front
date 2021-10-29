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
        },
        {
          path: '/space',
          index: 2,
          name: '空间动态',
          component: () => import('@/components/Main/space.vue')
        },
        {
          path: '/user',
          index: 3,
          name: '个人中心',
          component: () => import('@/components/Main/user.vue')
        },
        {
          path: '/communication',
          index: 4,
          name: '建议反馈',
          component: () => import('@/components/Main/communication.vue')
        },
        {
          path: '/version',
          index: 5,
          name: '版本',
          component: () => import('@/components/Main/version.vue')
        },
      ]
     }, {
        path: '/register',
        component: () => import('@/components/Register'),
        hidden: true
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