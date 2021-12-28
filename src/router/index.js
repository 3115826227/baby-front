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
          path: '/pc/im',
          index: 1,
          name: '聊天',
          icon: 'el-icon-chat-dot-round',
          component: () => import('@/components/Main/pc/im.vue')
        },
        // {
        //   path: '/pc/live',
        //   index: 2,
        //   name: '直播',
        //   component: () => import('@/components/Main/pc/live.vue')
        // },
        {
          path: '/pc/space',
          index: 3,
          name: '空间动态',
          icon: 'el-icon-orange',
          component: () => import('@/components/Main/pc/space.vue')
        },
        // {
        //   path: '/pc/blog',
        //   index: 4,
        //   name: '博客',
        //   component: () => import('@/components/Main/pc/blog.vue')
        // },
        {
          path: '/blog/manage',
          component:  () => import('@/components/Main/pc/blog_manage.vue'),
        },
        {
          path: '/blog/:blog_id',
          components: {
            blog_content: () => import('@/components/Main/pc/blog_content.vue'),
          },
          props: {
            blog_content: true
          }
        },
        {
          path: '/pc/user',
          index: 5,
          name: '个人中心',
          icon: 'el-icon-user',
          component: () => import('@/components/Main/pc/user.vue')
        },
        {
          path: '/pc/communication',
          index: 6,
          name: '建议反馈',
          icon: 'el-icon-position',
          component: () => import('@/components/Main/pc/communication.vue')
        },
        {
          path: '/pc/version',
          index: 7,
          name: '版本',
          icon: 'el-icon-guide',
          component: () => import('@/components/Main/pc/version.vue')
        },
        {
          path: '/mobile/im',
          index: 1001,
          icon: 'el-icon-chat-dot-round',
          component: () => import('@/components/Main/mobile/im.vue')
        },
        {
          path: '/mobile/space',
          index: 1002,
          icon: 'el-icon-orange',
          component: () => import('@/components/Main/mobile/space.vue')
        },
        {
          path: '/mobile/user',
          index: 1003,
          icon: 'el-icon-user',
          component: () => import('@/components/Main/mobile/user.vue')
        },
        {
          path: '/mobile/communication',
          index: 1004,
          icon: 'el-icon-position',
          component: () => import('@/components/Main/mobile/communication.vue')
        },
        {
          path: '/mobile/version',
          index: 1005,
          icon: 'el-icon-guide',
          component: () => import('@/components/Main/mobile/version.vue')
        },
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