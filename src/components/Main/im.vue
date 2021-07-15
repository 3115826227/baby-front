<template>
    <div id='im'>
        <div id="im-list">
          <div id="im-list-tabs">
             <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" stretch style="height:600px">
              <el-tab-pane label="消息" name="session">
                <el-card class="border-card" v-for="(item, index) in sessions" :key="index" style="margin:2% 0">
                  <div @click="selectSession(item.session_id)">
                  <el-row>
                    <el-col :span="20">
                      {{item.name}}
                      <el-tag size="mini">
                        <span v-if="item.session_type === 0">双人会话</span>
                      </el-tag>
                    </el-col>
                    <el-col :span="4" style="text-align:right;" v-if="item.unread">
                      <el-badge :value="item.unread" :max="99" class="item">
                      </el-badge>
                    </el-col>
                  </el-row>
                  <el-row style="color:gray;font-size:14px;" v-if="item.latest_message">
                    <el-col :span="12">
                      <span v-if="item.latest_message.send.account_id !== user_id">
                        <span v-if="item.latest_message.send.remark === ''">{{item.latest_message.send.username}}</span>
                        <span v-else="">{{item.latest_message.send.remark}}</span>
                        ：</span>{{item.latest_message.content}}
                    </el-col>
                    <el-col :span="12" style="text-align:right">
                      {{timestampToTime(item.latest_message.send_timestamp)}}
                    </el-col>
                  </el-row>
                  </div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="好友" name="friend">
                <el-row style="margin:2% 0">
                  <el-col :span="15" style="padding-right:4%">
                    <el-input type="text" size="small" />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="success" size="small">查询</el-button>
                  </el-col>
                  <el-col :span="5" style="text-align:right">
                    <el-button type="primary" size="small" @click="addFriendDrawer = true">添加好友</el-button>
                  </el-col>
                </el-row>
                <el-card class="border-card" v-for="(item, index) in friends" :key="index" style="margin:2% 0" shadow="hover">
                  <div>
                    {{item.remark}}
                  </div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="群组" name="group">
              </el-tab-pane>
              <el-tab-pane label="通知" name="notify">
                <el-card class="border-card" v-for="(item, index) in operators" :key="index" style="margin:2% 0" shadow="hover">
                  <div @click="selectOperator(item)">
                    <el-row>
                      <el-col :span="3">
                        <template v-if="item.origin.account_id === user_id">
                          已发送
                        </template>
                        <template v-else="">
                          <template v-if="!item.receive_read_status">
                            <el-tag type="danger" size="mini">未读</el-tag>
                          </template>
                          <template v-else="">
                            <el-tag type="success" size="mini">已读</el-tag>
                          </template>
                        </template>
                      </el-col>
                      <el-col :span="18">
                        <template v-if="item.opt_type === 1">
                          {{item.origin.username}}请求添加您好友
                        </template>
                        <template v-else-if="item.opt_type ===2">
                          {{item.origin.username}}请求加入会话
                        </template>
                      </el-col>
                      <el-col :span="3" style="text-align:right;padding:0;font-size:13px;font-weight:500;color:#F56C6C">
                        <a @click="deleteOperator(item.operator_id)">删除</a>
                        <!-- <el-button type="danger" size="mini">删除</el-button> -->
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div id="panel">
          <div v-if="panel === 1">
            <div id="im-content" v-if="session.session_id !== 0">
              <div id="im-panel">
                <el-card class="box-card">
                  <div slot="header">
                    <span>{{session.name}}</span>
                    <el-tag size="mini">
                      <span v-if="session.session_type === 0">双人会话</span>
                    </el-tag>
                  </div>
                  <div id="im-messages" style="height:380px;overflow:auto">
                    <template v-if="!noMoreMessage">
                      <div style="text-align:center" @click="getMoreSessionMessages(session.session_id)">
                        <el-link style="font-size:13px">查看更多消息</el-link>
                      </div>
                    </template>
                    <template v-else="">
                      <div style="text-align:center;font-size:13px;color:gray">
                        没有更多消息了
                      </div>
                    </template>
                    <template>
                      <el-row v-for="(item,index) in messages" :key="index">
                        <div v-if="item.send.account_id === user_id">
                          <el-row>
                            <el-col :span="12" style="padding:1% 0;text-align:right;margin-left:50%">
                              <span style="font-size:12px;color:gray;margin-right:2%">
                                {{timestampToTime(item.send_timestamp)}}
                              </span>
                              <span style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                {{item.content}}
                              </span>
                            </el-col>
                          </el-row>
                        </div>
                        <div v-else="">
                          <div style="font-size:12px;color:gray" @click="openFriendDrawer(item.send.account_id)">
                            <span v-if="item.send.remark !== ''">{{item.send.remark}}</span>
                            <span v-else="">{{item.send.username}}</span>
                          </div>
                          <el-row>
                            <el-col :span="10" style="padding:1% 0;">
                              <span style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                {{item.content}}
                              </span>
                              <span style="font-size:12px;color:gray;margin-left:2%">
                                {{timestampToTime(item.send_timestamp)}}
                              </span>
                            </el-col>
                          </el-row>
                        </div>
                      </el-row>
                    </template>
                  </div>
                </el-card>
              </div>
              <div id="im-send" style="text-align:right">
                <div style="margin:1% 0">
                  <el-input type="textarea" v-model="send_form.content" rows="4" style="width:68%;"></el-input>
                </div>
                <div>
                  <el-button type="primary" @click="send">发送</el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="panel === 2">
            <el-card class="border-card" style="height:600px">
              <div slot="header">
                <span>通知</span>
                  <template v-if="operator.origin.account_id === user_id">
                    已发送
                  </template>
                  <template v-else="">
                    <template v-if="!operator.receive_read_status">
                      <el-tag type="danger" size="mini">未读</el-tag>
                    </template>
                    <template v-else="">
                      <el-tag type="success" size="mini">已读</el-tag>
                    </template>
                  </template>
              </div>
              <div>
                <el-row style="margin:2% 0">
                  <el-col :span="2">
                    标题：
                  </el-col>
                  <el-col :span="12">
                    <template v-if="operator.opt_type === 1">
                      <span style="color:red">{{operator.origin.username}}</span> 请求添加您好友
                    </template>
                    <template v-else-if="operator.opt_type ===2">
                      {{operator.origin.username}}请求加入会话
                    </template>
                  </el-col>
                </el-row>
                <el-row style="margin:2% 0">
                  <el-col :span="2">
                    内容：
                  </el-col>
                  <el-col :span="12">
                    {{operator.content}}
                  </el-col>
                </el-row>
                <div style="text-align:center;margin:2% 0">
                  <template v-if="operator.confirm === 0">
                    <el-button type="primary">同意</el-button>
                    <el-button type="danger">拒绝</el-button>
                  </template>
                  <template v-else-if="operator.confirm === 1">
                    <span style="color:green">已同意</span>
                  </template>
                  <template v-else-if="operator.confirm === 2">
                    <span style="color:red">已拒绝</span>
                  </template>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <el-drawer title="添加好友" :visible.sync="addFriendDrawer" direction="rtl" :before-close="handleCloseAddFriendDrawer">
          <div style="margin:5%">
          <el-row>
            <el-col :span="18">
              <el-input type="text" v-model="query_user_form.account_id" placeholder="请输入好友账号" size="medium" />
            </el-col>
            <el-col :span="6" style="text-align:right">
              <el-button type="primary" size="medium" @click="getUser">查询</el-button>
            </el-col>
          </el-row>
          </div>
          <div v-if="query_user.account_id !== ''" style="margin:5%">
          <el-card class="border-card" shadow="hover">
            <el-row>
              <el-col :span="18">
                {{query_user.username}}
              </el-col>
              <el-col :span="6" style="text-align:right">
                <el-button type="primary" size="mini" @click="addFriend">添加好友</el-button>
              </el-col>
            </el-row>
          </el-card>
          </div>
        </el-drawer>
        <el-drawer
        title="好友信息"
        :visible.sync="friendDrawer"
        direction="rtl"
        :before-close="handleCloseFriendDrawer">
          <div style="margin:5%">
            <div style="text-align:center">
              <el-avatar :src="friend.head_img_url" :size="180" fit="fit"></el-avatar>
            </div>
            <el-row style="margin: 5% 0">
              <el-col :span="8" style="color:gray">
                好友账号：
              </el-col>
              <el-col :span="16">
                {{friend.account_id}}
              </el-col>
            </el-row>
            <el-row style="margin: 5% 0">
              <el-col :span="8" style="color:gray">
                好友昵称：
              </el-col>
              <el-col :span="16">
                {{friend.username}}
              </el-col>
            </el-row>
            <el-row style="margin: 5% 0">
              <el-col :span="8" style="color:gray">
                好友性别：
              </el-col>
              <el-col :span="16">
                <span v-if="friend.gender">男</span>
                <span v-else="">女</span>
              </el-col>
            </el-row>
            <el-row style="margin: 5% 0">
              <el-col :span="8" style="color:gray">
                好友年龄：
              </el-col>
              <el-col :span="16">
                {{friend.age}}
              </el-col>
            </el-row>
            <el-row style="margin: 5% 0">
              <el-col :span="8" style="color:gray">
                好友描述：
              </el-col>
              <el-col :span="16">
                <span v-if="friend.describe !== ''">{{friend.describe}}</span>
                <span v-else="">暂无描述</span>
              </el-col>
            </el-row>
            <div style="text-align:center;margin: 10% 0;">
              <el-button type="danger" size="medium">删除好友</el-button>
              <el-button type="warning" size="medium">加入黑名单</el-button>
            </div>
          </div>
        </el-drawer>
    </div>
</template>
<script>
import { session, sessionDetail, sessionMessages,readstatus, friends, addFriend, operators, deleteOpt } from '@/api/im'
import { query } from '@/api/user'

export default {
  name: 'im',
  data () {
    return {
      activeName: 'session',
      friendDrawer: false,
      addFriendDrawer: false,
      panel: 0,
      name: '1',
      friend: {},
      friends: [],
      session: {
        session_id: 0
      },
      session_message_req: {
        session_id: 0,
        page: 1,
        page_size: 10
      },
      query_user_form: {},
      query_user: {
        account_id: ''
      },
      noMoreMessage: false,
      operator: {},
      send_form: {},
      sessions: [],
      messages: [],
      operators: [],
      websock: null,
      connect: false,
      websockpath: '',
      groups: [],
      isCollapse: true,
      friend_detail_form: {},
      wxImgList: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'],
      wxImgVisisable: false,
      file: {}
    }
  },
  created () {
    this.init()
    this.getSessions()
    this.getFriends()
    this.getOperators()
    this.initWebSocket()
  },
  methods: {
    openFriendDrawer (accountId) {
      this.friendDrawer = true
      var that = this
      query(accountId).then(function (response) {
        if (response.data.code === 0) {
          that.friend = response.data.data
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleCloseFriendDrawer (done) {
      done()
    },
    handleCloseAddFriendDrawer (done) {
      done()
    },
    scrollToBottom () {
      this.$nextTick(() => {
        var msg = document.getElementById('im-messages')
        if (!msg.scrollHeight) {
          msg.scrollTop = msg.scrollHeight
        }
      })
    },
    init () {
      this.user_id = sessionStorage.getItem('user_id')
      this.username = sessionStorage.getItem('username')
    },
    add0 (m) {
      return m < 10 ? '0' + m : m
    },
    timestampToTime (timestamp) {
      var time = new Date(timestamp * 1000)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    },
    getSessions () {
      var that = this
      session().then(response => {
        if (response.data.code === 0) {
          that.sessions = response.data.data.sessions
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    getOperators () {
      var that = this
      operators().then(function (response) {
        if (response.data.code === 0) {
          that.operators = response.data.data.operators
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    getUser () {
      var that = this
      query(this.query_user_form.account_id).then(response => {
        if (response.data.code === 0) {
          that.query_user = response.data.data
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    selectSession (sessionId) {
      this.panel = 1
      this.getSessionDetail(sessionId)
      this.getNewSessionMessages(sessionId)
      var that = this
      for (var i = 0; i < this.sessions.length; i++) {
        if (this.sessions[i].session_id === sessionId) {
          this.sessions[i].unread = 0
          readstatus(sessionId).then(function (response) {
            if (response.data.code === 0) {
              that.getSessions()
            }
          })
            .catch(function (error) {
              console.log(error)
            })
        }
      }
    },
    selectOperator (item) {
      this.panel = 2
      this.operator = item
    },
    getSessionDetail (sessionId) {
      var that = this
      sessionDetail(sessionId).then(function (response) {
        if (response.data.code === 0) {
          that.session = response.data.data
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    getMoreSessionMessages (sessionId) {
      this.session_message_req.session_id = sessionId
      this.session_message_req.page += 1
      this.getSessionMessages()
    },
    getNewSessionMessages (sessionId) {
      this.messages = []
      this.session_message_req.session_id = sessionId
      this.session_message_req.page = 1
      this.getSessionMessages()
    },
    getSessionMessages () {
      var that = this
      sessionMessages(this.session_message_req).then(function (response) {
        if (response.data.code === 0) {
          if (response.data.data.messages.length < that.session_message_req.page_size) {
            that.noMoreMessage = true
          } else {
            that.noMoreMessage = false
          }
          var messages = that.messages
          messages.forEach(e => {
            response.data.data.messages.push(e)
          })
          that.messages = response.data.data.messages
          if (that.session_message_req.page === 1) {
            that.scrollToBottom()
          }
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteOperator (operatorId) {
      var that = this
      deleteOpt(operatorId).then(function (response) {
        if (response.data.code === 0) {
          that.$message.success('删除成功')
          that.getOperators()
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    addFriend () {
      var that = this
      addFriend({
        account_id: this.query_user.account_id
      })
        .then(function (response) {
          if (response.data.code === 0) {
            that.$message.success('添加成功')
            that.getFriends()
          } else {
            that.$message.error('请求出错')
          }
        })
        .catch(function (error) {
          console.log(error)
          that.$message.error('请求出错')
        })
    },
    judgeIsConnect () {
      if (!this.connect) {
        this.$message.error('通讯连接断开，请刷新重试')
        return false
      }
      return true
    },
    selectFriend (val) {
      if (val.id === '') {
        return
      }
      this.userInfoGet(val.friend)
      this.current_chat = val
      this.current_chat.type = 'friend'
      this.getMessage()
    },
    handleClick (data) {
        console.log(data)
    },
    getFriends () {
      var that = this
      friends()
      .then(response => {
        console.log(response)
        if (response.data.code === 0) {
          that.friends = response.data.data.friends
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    initWebSocket () { // 初始化weosocket
      const wsuri = 'ws://127.0.0.1:18070/api/connect/websocket?token=' + sessionStorage.getItem('token')
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
      if (redata.ws_message_notify_type === 2) {
        switch (redata.ws_message.session_message.session_message_type) {
          case 1:
          case 2:
          case 3:
            var newMessage = redata.ws_message.session_message.message
            for (var i = 0; i < this.sessions.length; i++) {
              if (this.sessions[i].session_id === newMessage.session_id) {
                this.sessions[i].latest_message = newMessage
                // 接收到的消息发送者不是自己，并且当前面板的不是接收到消息的会话
                if (newMessage.send.account_id !== this.user_id) {
                  if (this.messages.length === 0 || this.messages[0].session_id !== newMessage.session_id) {
                    // 该会话未读条数加1
                    this.sessions[i].unread += 1
                  }
                }
              }
            }
            if (this.messages.length !== 0) {
              if (this.messages[0].session_id === newMessage.session_id) {
                this.messages.push(newMessage)
                this.scrollToBottom()
              }
            }
        }
      }
    },
    websocketsend (Data) { // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
      this.connect = false
    },
    send () {
      if (!this.judgeIsConnect()) {
        return
      }
      let actions = {
        ws_message_notify_type: 2,
        ws_message: {
          session_message: {
            session_message_type: 3,
            message: {
              session_id: this.session.session_id,
              content: this.send_form.content
            }
          }
        }
      }
      this.websocketsend(JSON.stringify(actions))
      this.send_form = {}
    },
    changeSendContent () {
      let lastChat = this.send_form.content[this.send_form.content.length - 1]
      if (lastChat === '@' || lastChat === '\n') {
        if (lastChat === '\n') {
          this.send()
        }
      }
    },
    infoLook ($event) {
      console.log($event)
    },
    removeTab () {
      // this.current_chat = null
    },
    delSession (node) {
      var list = []
      for (var i = 0; i < this.chat.length; i++) {
        if (this.chat[i].id !== node.id) {
          list.push(this.chat[i])
        }
      }
      this.chat = list
    },
    imgClick (index) {
      this.wxImgVisisable = false
      let imgUrl = 'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + index + '.gif'
      this.send_form.image = true
      this.send_form.desc = imgUrl
      this.send()
    }
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'iconfont';  /* project id 1306051 */
  src: url('//at.alicdn.com/t/font_1306051_svucwz6pwna.eot');
  src: url('//at.alicdn.com/t/font_1306051_svucwz6pwna.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.woff') format('woff'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.svg#iconfont') format('svg');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
#im {
    margin-top: 30px;
    float: left;
    width: 100%;
}
#im-list {
    float: left;
    padding: 0;
    width: 30%;
    margin-right: 2%;
}
.chat-label-detail {
  float: left;
  background: #FFF;
  padding: 10px;
  border-radius: 5px;
  line-height: 10px;
  height: 632px;
  width: 15%;
  color: #606266;
  font-size: 14px;
}
.chat-detail-list {
  padding: 15px;
}
#message-receive {
    height: 380px;
    margin: 5px;
    padding-right: 15px;
    overflow:scroll;
    border-bottom: 1px solid #DCDFE6;
}
#message-tools {
  padding: 10px 0px;
}
#message-send {
    height: 135px;
}
#message-send-button {
    text-align: right;
}
.message-name {
    color: #909399;
    padding: 10px 5px;
}
.message-content {
    color: #414A60;
    background-color: #F2F5FA;
    padding: 8px 10px;
    /* margin-right: 50%; */
    border-radius: 5px;
}
.message-content-origin {
    color: #414A60;
    background-color: #F2F5FA;
    padding: 8px 15px;
    margin-left: 50%;
    border-radius: 5px;
    text-align: right;
}
li{
    list-style-type:none;
}
ul {
    padding: 0px;
    margin-bottom: 30px;
}
.clearfix {
  height: 5px;
}
.chat-label {
  float: left;
}
.chat-label-button {
  float: right;
  color: #409EFF;
}
.chat-hint {
  margin-top: 2px;
  text-align: center;
  font-size: 12px;
}
.chat-hint-more {
  color: #409EFF;
}
.chat-hint-end {
  color: gray;
}
#im-list-li-item {
  width: 100%;
}
.im-list-li {
  background-color: #EBEEF5;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.im-list-top {
  margin-bottom: 5px;
}
.im-list-remark {
  font-size: 14px;
}
.im-list-time {
  font-size: 12px;
  color: gray;
  text-align: right;
}
.im-list-content {
  font-size: 14px;
  color: gray;
}
.chat-label-info {
  font-size: 13px;
  line-height: 25px;
}
.user-verify {
  font-size: 11px;
  background-color: #efc100;
  color: white;
  border-radius: 5px;
  padding: 2px;
}
.user-unverify {
  font-size: 11px;
  background-color: #999;
  color: white;
  border-radius: 5px;
  padding: 2px;
}
.im-el-tab-pane {
  height: 565px;
}
.el-tabs--border-card>.el-tabs__content {
  height: 500px;
}
.el-tree {
  width: 100%;
  overflow: scroll;
}
.el-tree>.el-tree-node {
  display: inline-block;
  min-width: 100%;
}
.friend-tree-node {
  height: 50px;
}
.sr-image {
  color: #414A60;
  background-color: #F2F5FA;
  padding: 8px 10px;
  border-radius: 5px;
}
.image {
  width: 38px;
  height: 38px;
  color: white;
  font-size: 12px;
  vertical-align: middle;
  padding: 6px;
  border: 1px solid white;
  border-radius: 50%;
  /* background-color: rgb(112, 118, 250); */
  background-color: #409eff;
  margin-right: 5px;
}

.group-list {
  padding: 20px 5px;
}

#chat-label-detail-title {
  padding:6px 0px;
  text-align:center;
  border-bottom: 1px solid #DCDFE6;
  height:20px;
  font-weight: bolder;
}
</style>
