<template>
    <el-container id="index-container">
      <!-- <div id="pc" v-if="!mobile"> -->
        <el-header id='header'>
            <el-menu mode="horizontal" router :default-active="$route.path" class="el-menu-demo"
              @open="handleOpen" @close="handleClose"
              background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item><router-link class="header-label" to="/index">宝宝煎米果</router-link></el-menu-item>
              <asideBarItem v-for="router in routers" :router="router" :mobile="mobile" :key="router.path">
              </asideBarItem>
              <el-submenu style="float:right;" :index="$route.path">
                <template slot="title">
                  <span style="margin-right:2%;">
                    
                    <span v-if="connect">
                      <el-tag type="success" size="small">状态：在线</el-tag>
                    </span>
                    <span v-else="">
                      <el-tag type="info" size="mini">状态：离线</el-tag>
                    </span>
                  </span>
                  <el-avatar :src="detail.head_img_url" size="small" fit="fit"></el-avatar>
                  <span> {{detail.username}}@baby.com</span>
                </template>
                <el-menu-item index="4-2" @click="logout">退出登录</el-menu-item>
              </el-submenu>
            </el-menu>
        </el-header>
        <el-container id="content" style="height:auto">
            <el-main class="el-main" style="height:auto">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item v-for="item in levelList" :key="item.path">
                    <span>{{item.name}}</span>
                  </el-breadcrumb-item>
                </el-breadcrumb>
                <Content :websocketClient = "websock" :websocketMessage="websocketMessage"></Content>
            </el-main>
        </el-container>
      <!-- </div> -->
      <div id="mobile" v-if="mobile">
        <div id='footer-mobile'>
            <el-menu mode="horizontal" router :default-active="$route.path"  class="el-menu-demo"
              @open="handleOpen" @close="handleClose" active-text-color="red">
              <asideBarItem v-for="router in mobileRouters" :router="router" :mobile="mobile" :key="router.path">
              </asideBarItem>
              <!-- <el-submenu style="float:right;" :index="$route.path">
                <template slot="title">
                  <el-avatar :src="detail.head_img_url" size="small" fit="fit"></el-avatar>
                  <span>{{detail.username}}@baby.com</span>
                </template>
                <el-menu-item index="4-2" @click="logout">退出登录</el-menu-item>
              </el-submenu> -->
            </el-menu>
        </div>
      </div>
    </el-container>
</template>

<script>
import asideBarItem from '../components/Bar/asideBarItem'
import Content from '../components/Main/pc/content'
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
      connect: false,
      websocketMessage: {},
      mobile: false
    }
  },
  computed: {
    routers () {
      let children = []
      this.$router.options.routes[0].children.forEach(e => {
        if (e.path.indexOf('/pc') > -1) {
          children.push(e)
        }
      });
      return children
    },
    mobileRouters () {
      let children = []
      this.$router.options.routes[0].children.forEach(e => {
        if (e.path.indexOf('/mobile') > -1) {
          children.push(e)
        }
      });
      return children
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
    async getDetail () {
      if (!localStorage.getItem('token')) {
          window.location.href = '/'
      }
      await detail().then(response => {
          if (response.data.code === 0) {
            this.detail = response.data.data
            if (response.data.data.verify === true) {
              this.verify = '已认证'
            } else {
              this.verify = ''
            }
            localStorage.setItem('detail', JSON.stringify(this.detail))
          } else {
            window.location.href = '/'
          }
        })
        .catch(error => {
          console.log(error)
          window.location.href = '/'
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
      if (!localStorage.getItem('token')) {
        window.location.href = '/'
      }
      const wsuri = process.env.VUE_APP_BASE_API.replace('http', 'ws') + '/connect/websocket?token=' + localStorage.getItem('token')
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
        if (redata.ws_message.session_message.session_message_type === 3) {
          if (redata.ws_message.send.account_id != localStorage.getItem('user_id')) {
            this.$notify.success({
              title: '消息',
              message: msgTip,
              showClose: false
            });
          }
        }
        break
      case 3:
        msgTip += '空间消息通知'
        break
      }
      this.websocketMessage = redata
    },
    websocketclose (e) { // 关闭
      this.$message.error('连接已断开，请刷新页面重试')
      console.log(e)
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

#footer-mobile {
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0px;
  font-size:13px;
}
</style>
