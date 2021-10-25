<template>
    <el-container id="index-container">
        <el-header id='header'>
            <el-menu mode="horizontal" router :default-active="$route.path" class="el-menu-demo"
              @open="handleOpen" @close="handleClose"
              background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item><router-link class="header-label" to="/index">宝宝煎米果</router-link></el-menu-item>
              <asideBarItem v-for="router in routers" :router="router" :key="router.path">
              </asideBarItem>
              <el-submenu style="float:right;" :index="$route.path">
                <template slot="title">
                  <el-avatar :src="detail.head_img_url" size="small" fit="fit"></el-avatar>
                  <span>{{detail.username}}@baby.com</span>
                </template>
                <el-menu-item index="4-2" @click="logout">退出登录</el-menu-item>
              </el-submenu>
            </el-menu>
        </el-header>
        <el-container id="content" style="height:100%">
            <el-main class="el-main" style="height:100%">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item v-for="item in levelList" :key="item.path">
                    <span>{{item.name}}</span>
                  </el-breadcrumb-item>
                </el-breadcrumb>
                <Content></Content>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import asideBarItem from '../components/Bar/asideBarItem'
import Content from '../components/Main/content'
import { detail, logout } from '@/api/user'

export default {
  name: 'index',
  components: {
    Content,
    asideBarItem
  },
  data () {
    return {
      value: new Date(),
      levelList: null,
      detail: {},
      privateMessageUnreadNumber: 1
    }
  },
  computed: {
    routers () {
      console.log(this.$router.options.routes)
      return this.$router.options.routes[0].children
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      // 点击打开时当前的路径
      console.log(key, keyPath, 'handleOpen');
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath, 'handleClose');
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      this.levelList = matched
    },
    getDetail () {
      if (!sessionStorage.getItem('token')) {
          window.location.href = '/'
      }
      detail().then(response => {
          this.detail = response.data.data
          if (response.data.data.verify === true) {
            this.verify = '已认证'
          } else {
            this.verify = ''
          }
          sessionStorage.setItem('detail', JSON.stringify(this.detail))
        })
        .catch(error => {
          console.log(error)
        })
    },
    logout () {
      logout()
        .then(function (response) {
          if (response.data.code === 0) {
            window.location.href = '/'
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    toUser() {
      window.location.href = "/user"
    }
  },
  created () {
    this.getBreadcrumb()
    this.getDetail()
  }
}
</script>

<style scoped>
#index-container {
  background-color: #f4f5f5;
  height:  100%;
}
.el-header {
  padding: 0;
}
.header-label {
  font-size: 18px;
  text-decoration: none;
}
.a:-webkit-any-link {
  text-decoration: none;
}
.el-main {
  padding: 20px 5px;
}
</style>
