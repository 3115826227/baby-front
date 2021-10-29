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
                <Content :websocketClient = "websock" :websocketMessage="websocketMessage"></Content>
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
      privateMessageUnreadNumber: 1,
      websock: null,
      websocketMessage: {}
    }
  },
  computed: {
    routers () {
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
          if (response.data.code === 0) {
            this.detail = response.data.data
            if (response.data.data.verify === true) {
              this.verify = '已认证'
            } else {
              this.verify = ''
            }
            sessionStorage.setItem('detail', JSON.stringify(this.detail))
          } else {
            window.location.href = '/'
          }
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
    },
    initWebSocket () { // 初始化weosocket
      const wsuri = process.env.VUE_APP_BASE_API.replace('http', 'ws') + '/connect/websocket?token=' + sessionStorage.getItem('token')
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      console.log('连接成功')
      this.connect = true
    },
    websocketonerror () { // 连接建立失败重连
      // this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      let redata = JSON.parse(e.data)
      console.log(redata)
      let msgTip = '收到一条新的'
      switch (redata.ws_message_notify_type) {
      case 1:
        msgTip += '私信消息通知'
        break
      case 2:
        msgTip += '会话消息通知'
        break
      case 3:
        msgTip += '空间消息通知'
        break
      }
      if (redata.ws_message.send.account_id != sessionStorage.getItem('user_id')) {
        this.$notify.success({
          title: '消息',
          message: msgTip,
          showClose: false
        });
      }
      this.websocketMessage = redata
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
      this.connect = false
    }
  },
  created () {
    this.getBreadcrumb()
    this.getDetail()
    this.initWebSocket()
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
