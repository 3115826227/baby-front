<template>
    <div id='im'>
        <div id="im-list">
          <div id="im-list-tabs">
             <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" stretch style="height:600px">
              <el-tab-pane label="消息" name="session" style="height:540px;overflow:auto">
                <el-card class="border-card" v-for="(item, index) in sessionDialogs" :key="index" style="margin:2% 0;">
                  <el-row>
                    <el-col :span="20">
                  <div @click="selectSession(item.session_id)">
                  <el-row>
                    <el-col :span="20">
                      {{item.name}}
                      <el-tag size="mini">
                        <span v-if="item.session_type === 0">双人会话</span>
                        <span v-else-if="item.session_type === 1">讨论组</span>
                        <span v-else-if="item.session_type === 2">群会话</span>
                      </el-tag>
                    </el-col>
                    <el-col :span="4" style="text-align:right;" v-if="item.unread">
                      <el-badge :value="item.unread" :max="99" class="item">
                      </el-badge>
                    </el-col>
                  </el-row>
                  <el-row style="color:gray;font-size:14px;margin-top:2%" v-if="item.latest_message">
                    <el-col :span="12">
                      <span v-if="item.latest_message.message_type !== 3">
                        <span v-if="item.latest_message.send.account_id !== user_id">
                        <span v-if="item.latest_message.send.remark === ''">{{item.latest_message.send.username}}</span>
                        <span v-else="">{{item.latest_message.send.remark}}</span>
                        ：</span>
                          <span v-if="item.latest_message.message_type === 0">{{item.latest_message.content}}</span>
                          <span v-else-if="item.latest_message.message_type === 1">
                            [文件]
                          </span>
                          <span v-else-if="item.latest_message.message_type === 2">
                            [图片]
                          </span>
                          <span v-else-if="item.latest_message.message_type === 101">
                            [已拒绝通话]
                          </span>
                          <span v-else-if="item.latest_message.message_type === 100">
                            [通话记录]
                          </span>
                      </span>
                      <span v-else="">
                        <span v-if="item.latest_message.send.account_id !== user_id">
                          <span v-if="item.latest_message.send.remark === ''">{{item.latest_message.send.username}}</span>
                          <span v-else="">{{item.latest_message.send.remark}}</span>
                        </span>
                        <span v-else="">您</span>撤回了一条消息
                      </span>
                    </el-col>
                    <el-col :span="12" style="text-align:right" v-if="item.latest_message.send_timestamp">
                      {{timestampToTime(item.latest_message.send_timestamp)}}
                    </el-col>
                  </el-row>
                  </div>    
                    </el-col>
                    <el-col :span="4" style="text-align:right;font-size:13px;padding-left:4%">
                      <!-- <div>
                        <el-button size="mini" type="warning">置顶</el-button>
                      </div>
                      <div>
                        <el-button size="mini" type="danger">删除</el-button>
                      </div> -->
                      <!-- <div style="padding:7% 0%;border-radius:5px;background-color:#e6a23c;text-align:center;margin-bottom:5%;">置顶</div> -->
                      <div style="padding:35% 20%;border-radius:5px;background-color:#f56c6c;text-align:center;color:white" @click="deleteSessionDialog(item.session_id)">
                        删除
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="好友" name="friend" style="height:530px;overflow:auto">
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
                  <div @click="findSessionByFriend(item.account_id)">
                    {{item.remark}}
                  </div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="会话" name="group" style="height:530px;overflow:auto">
                <el-row style="margin:2% 0">
                  <el-col :span="15" style="padding-right:4%">
                    <el-input type="text" size="small" />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="success" size="small">查询</el-button>
                  </el-col>
                  <el-col :span="5" style="text-align:right">
                    <el-button type="primary" size="small" @click="addSessionDrawer = true">创建会话</el-button>
                  </el-col>
                </el-row>
                <el-card class="border-card" v-for="(item, index) in sessions" :key="index" style="margin:2% 0" shadow="hover">
                  <div @click="selectSession(item.session_id)">
                    {{item.name}}
                  </div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="通知" name="notify" style="height:530px;overflow:auto">
                <el-card class="border-card" v-for="(item, index) in operators" :key="index" style="margin:2% 0" shadow="hover">
                  <div @click="selectOperator(item)" style="font-size:14px;">
                    <el-row>
                      <el-col :span="4">
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
                      <el-col :span="16">
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
              <el-tab-pane label="管理" name="manage" style="font-size:14px;padding:3%">
                <el-row>
                  <el-col :span="16">
                    <span>添加我为好友是否需要确认：</span>
                  </el-col>
                  <el-col :span="8">
                      <el-radio-group v-model="userManage.add_friend_permission_type">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                  </el-col>
                </el-row>
                <div style="text-align:center;margin-top:10%">
                  <el-button type="primary" size="small" @click="updateUserManage">修改</el-button>
                </div>
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
                    <el-row>
                      <el-col :span="20">
                        <span>{{session.name}} </span>
                        <el-tag size="mini">
                          <span v-if="session.session_type === 0">双人会话</span>
                          <span v-else-if="session.session_type === 1">讨论组</span>
                          <span v-else-if="session.session_type === 2">群会话</span>
                        </el-tag>
                        <span v-if="session.session_type === 0" style="margin-left:1%">
                          <el-tag size="mini" type="info" v-if="current_friend_status === 1">
                            <span>离线</span>
                          </el-tag>
                          <el-tag size="mini" type="success" v-if="current_friend_status === 11">
                            <span>电脑在线</span>
                          </el-tag>
                        </span>
                        <span v-if="user_inputting.inputting && user_inputting.session_id === session.session_id" style="color:gray;font-size:13px;margin-left:1%">对方正在输入</span>
                      </el-col>
                      <el-col :span="4" style="text-align:right;font-size:14px;font-weight:500;color:#F56C6C">
                        <span @click="flushMessage(session)">清空消息</span>
                      </el-col>
                    </el-row>
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
                          <div v-if="item.message_type !== 3">
                            <el-row>
                            <el-col :span="12" style="padding:1% 0;text-align:right;margin-left:50%">
                              <span style="margin-right:1%;font-size:12px;">
                                <span style="margin-right:1%;color:#f56c6c" @click="deleteMessage(item)">删除</span>
                                <span style="margin-right:1%;color:#e6a23c" @click="withDrawnMessage(item)">撤回</span>
                                <span v-if="item.read_user_total + 1 === session.joins.length" style="color:gray">
                                  <i class="el-icon-success"></i>
                                </span>
                                <span v-else="">
                                  <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                                    >
                                    <el-tabs type="border-card" stretch>
                                      <el-tab-pane label="已读">
                                        <el-card v-for="item in message_read_users.read_users" :key="item.account_id">
                                          {{item.username}}
                                        </el-card>
                                      </el-tab-pane>
                                      <el-tab-pane label="未读">
                                        <el-card v-for="item in message_read_users.unread_users" :key="item.account_id">
                                          {{item.username}}
                                        </el-card>
                                      </el-tab-pane>
                                    </el-tabs>
                                    <div class="read-total-number" slot="reference" @click="getReadUsers(item)"></div>
                                  </el-popover>
                                </span>  
                              </span>
                              <span v-if="item.message_type === 0" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                {{item.content}}
                              </span>
                              <div v-else-if="item.message_type === 1"
                                style="line-height:70px;text-align:center;font-size:14px;display:inline;padding:6% 8%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 5px">
                                <a :href="item.content" target="_blank">
                                  <i class="el-icon-document"></i>
                                  {{item.content.split("/")[item.content.split("/").length-1]}}
                                </a>
                              </div>
                              <span v-else-if="item.message_type === 2" @click="loadBigImage(item.content)">
                                <!-- <img :src="item.content" width="50px" /> -->
                                <el-avatar shape="square" :size="60" fit="fill" :src="item.content"></el-avatar>
                              </span>
                              <span v-else-if="item.message_type === 100" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                通话时长 [{{timeFormat(item.content)}}]
                              </span>
                              <span v-else-if="item.message_type === 101" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                通话已拒绝
                              </span>
                              <span v-else-if="item.message_type === 102" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                对方无响应
                              </span>
                            </el-col>
                            </el-row>
                            <div style="text-align:right">
                              <span style="font-size:12px;color:gray;">
                                  {{timestampToTime(item.send_timestamp)}}
                              </span>
                            </div>
                          </div>
                          <div v-else="" style="text-align:center;color:gray;font-size:13px;margin-top:1%;margin-bottom:1%">
                            您撤回了一条消息
                          </div>
                        </div>
                        <div v-else="">
                          <div v-if="item.message_type != 3">
                            <div style="font-size:12px;color:gray" @click="openFriendDrawer(item.send.account_id)">
                              <span v-if="item.send.remark !== ''">{{item.send.remark}}</span>
                              <span v-else="">{{item.send.username}}</span>
                            </div>
                            <el-row>
                              <el-col :span="10" style="padding:1% 0;">
                                <span v-if="item.message_type === 0"  style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                  {{item.content}}
                                </span>
                                 <span v-else-if="item.message_type === 100" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                  通话时长 [{{timeFormat(item.content)}}]
                                </span>
                                <span v-else-if="item.message_type === 101" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                  通话已拒绝
                                </span>
                                <span v-else-if="item.message_type === 102" style="padding:1% 2%;background-color:#C0C4CC;border-radius:8px;">
                                  对方无响应
                                </span>
                                <span style="margin-left:1%;color:#f56c6c;font-size:12px;" @click="deleteMessage(item)">删除</span>
                              </el-col>
                            </el-row>
                            <div style="">
                                <span style="font-size:12px;color:gray;">
                                  {{timestampToTime(item.send_timestamp)}}
                                </span>
                            </div>
                          </div>
                          <div v-else="" style="text-align:center;color:gray;font-size:13px;margin-top:1%;margin-bottom:1%">
                            <span v-if="item.send.remark !== ''">{{item.send.remark}}</span>
                            <span v-else="">{{item.send.username}}</span>
                            撤回了一条消息
                          </div>
                        </div>
                      </el-row>
                    </template>
                  </div>
                  <HR></HR>
                  <div style="height:5px;">
                  <el-row>
                    <el-col :span="1">
                        <el-popover
                          placement="bottom"
                          width="400"
                          trigger="click"
                          >
                          <span v-for="(item, index) in wxImgList" :key="index" @click="imgClick(index)">
                            <img :src="'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/'+index+'.gif'" />
                          </span>
                          <i slot="reference" class="el-icon-circle-plus-outline"></i>
                        </el-popover>
                    </el-col>
                    <el-col :span="1">
                      <el-upload ref="upload_image" action="#" :auto-upload="false" :show-file-list="false" :on-change="sendImage">
                          <i class="el-icon-picture-outline"></i>
                      </el-upload>
                    </el-col>
                    <el-col :span="1">
                      <el-upload ref="upload_file" action="#" :auto-upload="false" :show-file-list="false" :on-change="sendFile">
                          <i class="el-icon-document"></i>
                      </el-upload>
                    </el-col>
                    <el-col :span="1">
                      <div @click="sendWebRTC(100)">
                         <i class="el-icon-video-camera"></i>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                </el-card>
              </div>
              <div id="im-send" style="text-align:right">
                <div style="margin:1% 0">
                  <el-input type="textarea" v-model="send_form_content" rows="4" style="width:68%;"></el-input>
                </div>
                <div>
                  <el-button type="primary" @click="send">发送</el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="panel === 2">
            <el-card class="border-card" style="height:600px;">
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
                    <el-button type="primary" @click="confirmOperator({operator_id:operator.operator_id,confirm:true})">同意</el-button>
                    <el-button type="danger" @click="confirmOperator({operator_id:operator.operator_id,confirm:false})">拒绝</el-button>
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
              <template v-if="query_user.is_friend">
                <el-col :span="12">
                  {{query_user.remark}} <el-tag type="success" size="small">好友</el-tag>
                </el-col>
                <el-col :span="12" style="text-align:right">
                  <el-button type="primary" size="mini" @click="addFriend" disabled>添加好友</el-button>
                </el-col>
              </template>
              <template v-else="">
                <el-col :span="18">
                  {{query_user.username}}
                </el-col>
                <el-col :span="6" style="text-align:right">
                  <el-button type="primary" size="mini" @click="addFriend">添加好友</el-button>
                </el-col>
              </template>
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
        <el-drawer
        title="添加会话"
        :visible.sync="addSessionDrawer"
        direction="rtl"
        :before-close="handleCloseAddSessionDrawer">
          <el-table :data="friends" ref="multipleSessionFriendSelection" style="width: 100%" @selection-change="handleSelectionFriendChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="昵称">
            </el-table-column>
          </el-table>
          <el-row style="margin-top:5%">
            <el-col :span="6" style="line-height:40px;text-align:center">
              <label>会话名称：</label>
            </el-col>
            <el-col :span="16">
              <el-input v-model="session_name" placeholder="请输入会话名称" style="width:80%"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top:5%">
            <el-col :span="6" style="line-height:20px;text-align:center">
              <label>会话类别：</label>
            </el-col>
            <el-col :span="16">
              <el-radio-group v-model="session_type">
                <el-radio v-for="item in session_types" :key="item.id" :label="item.id">{{item.name}}</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row style="text-align:center;margin-top:5%">
            <el-button type="primary" @click="addSession()">添加会话</el-button>
          </el-row>
        </el-drawer>
        <el-dialog title="视频通话" :visible.sync="videoVisible" width="70%" :before-close="handleCloseVideo">
          <el-row>
            <el-col :span="12">
              <video id="local-video" width="100%" autoplay muted></video>
            </el-col>
            <el-col :span="12">
              <video id="remote-video" width="100%" autoplay muted></video>
            </el-col>
          </el-row>
          <div style="text-align:center" v-if="hangupVisible">
            <el-button type="danger" @click="sendWebRTC(303)">挂断</el-button>
          </div>
          <div>
            <div style="text-align:center">
              {{videoNotify}}
            </div>
            <div style="text-align:center" v-if="videoReceive">
              <el-button type="primary" @click="sendWebRTC(200)">接受</el-button>
              <el-button type="danger" @click="sendWebRTC(302)">拒绝</el-button>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="查看大图" :visible.sync="bigImageVisible" width="80%">
          <div style="text-align:center">
            <img :src="currentBigImageUrl" width="auto">
          </div>
        </el-dialog>
    </div>
</template>
<script>
import { addSession, session, sessionDialog, deleteSessionDialog, sessionDetail, sessionMessages,readstatus, friends, findSessionByFriend, addFriend, addOperator, confirmOperator, operators, deleteOpt, userManage, updateUserManage, getReadUsers, deleteMessage, withDrawnMessage, flushMessage } from '@/api/im'
import { query } from '@/api/user'
import { upload } from '@/api/file'
var log = msg => {
  console.log(msg)
};
export default {
  name: 'im',
  props: ['websocketClient', 'websocketMessage'],
  data () {
    return {
      activeName: 'session',
      friendDrawer: false,
      addFriendDrawer: false,
      addSessionDrawer: false,
      panel: 0,
      name: '1',
      friend: {},
      friends: [],
      multipleSessionFriendSelection: [],
      session_types: [{
        id: 1,
        name: '讨论组会话'
      }, {
        id: 2,
        name: '群会话'
      }],
      session_type: 1,
      session_name: '',
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
      send_form_content: '',
      sessionDialogs: [],
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
      file: {},
      userManage: {},
      videoVisible: false,
      videoNotify: '',
      videoReceive: false,
      hangupVisible: false,
      inviteAccount: '',
      bigImageVisible: false,
      currentBigImageUrl: '',
      remoteSession: '',
      localSession: '',
      localPC: null,
      remotePC: null,
      local_video: {
        srcObject: null
      },
      remote_video: {
        srcObject: null
      },
      constraints: {
          audio: {
            noiseSuppression: true,
            echoCancellation: true
          },
          video: {
            width: 1920,
            height: 1080,
            frameRate: 30,
            facingMode: "environment"
        }
      },
      user_inputting: {
        session_id: 0,
        inputting: false
      },
      current_friend_status: 0,
      message_read_users: {}
    }
  },
  watch: {
    websocketMessage (val) {
      this.receiveMessage(val)
    },
    send_form_content (val, oldVal) {
      if (!this.judgeIsConnect()) {
        return
      }
      if (this.session.session_type !== 0) {
        return
      }
      let notify = {
        ws_message_notify_type: 2,
        ws_message: {
          ws_message_type: 4,
          session_message: {
            session_message_type: 2,
            session: {
              session_id: this.session.session_id,
              users: this.session.joins
            },
          }
        }
      }
      if (val !== '' && oldVal === '' ) {
        // 开始输入
        notify.ws_message.session_message.session.inputting = true
      } else if (val === '' && oldVal !== '') {
        // 停止输入
        notify.ws_message.session_message.session.inputting = false
      } else {
        return
      }
      this.websock.send(JSON.stringify(notify))
    },
    deep: true,
    immediate: true
  },
  created () {
    this.init()
    this.getSessions()
    this.getSessionDialog()
    this.getFriends()
    this.getOperators()
    this.getUserManage()
    this.initWebSocket()
  },
  methods: {
    loadBigImage (content)  {
      this.currentBigImageUrl = content
      this.bigImageVisible = true
      console.log(this.currentBigImageUrl, this.bigImageVisible)
    },
    uploadData (data, file_type) {
      upload(data).then(response => {
        console.log(response)
        if (response.data.code === 0) {
          this.send_form_type = file_type
          this.send_form_content = response.data.data.down_url
          this.send()
        } else {
          this.$message.error('上传失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求错误')
      })
    },
    sendFile () {
      let file = this.$refs.upload_file.$data.uploadFiles[0]
      var data = new FormData();
      data.append('file', file.raw);
      this.uploadData(data, 1)
    },
    sendImage () {
      let file = this.$refs.upload_image.$data.uploadFiles[0]
      var data = new FormData();
      data.append('file', file.raw);
      this.uploadData(data, 2)
    },
    sleepTime (time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    },
    async sendWebRTC (session_message_type) {
      if (!this.judgeIsConnect()) {
        return
      }
      this.videoVisible = true
      let actions = {
        ws_message_notify_type: 2,
        ws_message: {
          ws_message_type: session_message_type,
          session_message: {
            session_message_type: 2,
            session: {
              session_id: this.session.session_id,
            },
            web_rtc: {}
          }
        }
      }
      if (session_message_type === 100) {
        // 通话邀请
        this.webRTCSession(true)
        await this.sleepTime(3000)
        actions.ws_message.session_message.web_rtc.account_id = sessionStorage.getItem('user_id')
        actions.ws_message.session_message.web_rtc.sdp = this.localSession
      } else if (session_message_type === 200) {
        // 接受通话
        this.webRTCSession(true)
        await this.sleepTime(3000)
        this.webRTCSession(false)
        await this.sleepTime(3000)
        actions.ws_message.session_message.web_rtc.invite_account = this.inviteAccount
        actions.ws_message.session_message.web_rtc.sdp = this.localSession
        actions.ws_message.session_message.web_rtc.remote_sdp = this.remoteSession
      }
      this.websocketsend(JSON.stringify(actions))
      if (session_message_type === 100) {
        this.videoNotify = '请求已发送，请稍等'
      } else if (session_message_type === 303) {
        this.videoNotify = ''
        this.hangupVisible = false
        this.videoVisible = false
        this.$message.warning('通话已挂断')
        this.localSession = ''
        this.localPC = null
        this.remoteSession = ''
        this.remotePC = null
      } else {
        this.videoReceive = false
        if (session_message_type === 200) {
          this.videoNotify = '通话进行中'
          this.hangupVisible = true
          // this.videoVisible = false
        } else if(session_message_type === 302) {
          this.videoNotify = ''
          this.videoVisible = false
          this.$message.warning('通话已拒绝')
        }
      }
    },
    webRTCSession (isPublisher) {
      var that = this;
      let pc = new RTCPeerConnection({
          iceServers: [
              {
                  urls: 'stun:stun2.l.google.com:19302'
              }
          ]
      });
      pc.oniceconnectionstatechange = e => {
        log(e);
        log(pc.iceConnectionState);
      }
      console.log(isPublisher)
      if (isPublisher) {
          pc.onicecandidate = event => {
              if (event.candidate === null) {
                  that.localSession = btoa(JSON.stringify(pc.localDescription))
              }
          };
          navigator.mediaDevices.getUserMedia({video: true, audio: false})
              .then(stream => {
                  stream.getTracks().forEach(track => pc.addTrack(track, stream));
                  // this.local_video.srcObject = stream;
                  that.$nextTick(()=> {
                   document.getElementById('local-video').srcObject = stream;
                  })
                  pc.createOffer()
                      .then(d => pc.setLocalDescription(d))
                      .catch(log)
              }).catch(log);
          that.localPC = pc
      } else {
          pc.onicecandidate = event => {
              if (event.candidate === null) {
                  that.remoteSession = btoa(JSON.stringify(pc.localDescription))
              }
          };
          pc.addTransceiver('video');
          pc.createOffer()
              .then(d => pc.setLocalDescription(d))
              .catch(log);

          pc.ontrack = function (event) {
              // let el = document.getElementById('remote-video');
              that.$nextTick(()=> {
                document.getElementById('remote-video').srcObject = event.streams[0];
              })
              // this.remote_video.srcObject = event.streams[0]
              // el.srcObject = event.streams[0];
              // el.autoplay = true;
          };
          that.remotePC = pc
      }
    },
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
    addSession () {
      let ids = []
      ids.push(sessionStorage.getItem('user_id'))
      this.multipleSessionFriendSelection.forEach(element => {
        ids.push(element.account_id)
      })
      let params = {
        session_type: this.session_type,
        session_level: 1,
        name: this.session_name,
        joins: ids
      }
      console.log(params)
      addSession(params).then(response => {
        if (response.data.code === 0) {
          this.$message.success('创建成功')
          this.getSessions()
        } else {
          this.$message.error('创建失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求错误')
      })
      this.addSessionDrawer = false
    },
    handleCloseFriendDrawer (done) {
      done()
    },
    handleCloseAddFriendDrawer (done) {
      done()
    },
    handleCloseAddSessionDrawer (done) {
      done()
    },
    handleSelectionFriendChange (val) {
        this.multipleSessionFriendSelection = val;
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
    timeFormat (time) {
      var h = parseInt(time/3600)
      time = time - h*3600
      var m = parseInt(time/60)
      var s = time - m *60
      return this.add0(h) + ':' + this.add0(m) + ':' + this.add0(s)
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
          that.sessions = response.data.data.list
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    getSessionDialog () {
      sessionDialog().then(response => {
        if (response.data.code === 0) {
          this.sessionDialogs = response.data.data.list
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    deleteSessionDialog (session_id) {
      deleteSessionDialog(session_id).then(response => {
        if (response.data.code === 0) {
          for (let i = 0; i < this.sessionDialogs.length; i++) {
            if (this.sessionDialogs[i].session_id == session_id) {
              this.sessionDialogs.splice(i, 1)
            }
          }
        } else {
          this.$message.error('删除失败')
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    addOperator (data) {
      addOperator(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('好友请求已发出')
        } else {
          this.$message.error('请求错误')
        }
      })
      .catch(error => {
        console.log(error)
        this.$message.error('请求错误')
      })
    },
    getOperators () {
      operators().then(response => {
        if (response.data.code === 0) {
          this.operators = response.data.data.operators
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
              that.getSessionDialog()
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
      sessionDetail(sessionId).then(response => {
        if (response.data.code === 0) {
          this.session = response.data.data
          let user_id = sessionStorage.getItem('user_id')
          if (this.session.session_type === 0) {
            for (var i = 0; i < this.session.joins.length; i++) {
                if (this.session.joins[i].account_id != user_id) {
                  this.current_friend_status = this.session.joins[i].online_type
                  break;
                }
            }
          }
        }
      })
        .catch(error => {
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
      this.session.session_id = this.session_message_req.session_id
      sessionMessages(this.session_message_req).then(response => {
        if (response.data.code === 0) {
          if (response.data.data.messages.length < this.session_message_req.page_size) {
            this.noMoreMessage = true
          } else {
            this.noMoreMessage = false
          }
          var messages = this.messages
          messages.forEach(e => {
            response.data.data.messages.push(e)
          })
          this.messages = response.data.data.messages
          if (this.session_message_req.page === 1) {
            this.scrollToBottom()
          }
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    confirmOperator (data) {
      confirmOperator(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('回复成功')
          this.getOperators()
        } else {
          this.$message.error('回复失败')
        }
      })
        .catch(function (error) {
          console.log(error)
          this.$message.error('请求错误')
        })
    },
    deleteOperator (operatorId) {
      deleteOpt(operatorId).then(response => {
        if (response.data.code === 0) {
          this.$message.success('删除成功')
          this.getOperators()
        } else {
          this.$message.error('删除失败')
        }
      })
        .catch(function (error) {
          console.log(error)
          this.$message.error('请求错误')
        })
    },
    addFriend () {
      addFriend({
        account_id: this.query_user.account_id
      }).then(response => {
          if (response.data.code === 0) {
            this.$message.success('添加成功')
            this.getUser(this.query_user.accountId)
            this.getFriends()
          } else if (response.data.code === 20010) {
            let data = {
              receive: this.query_user.account_id,
              opt_type: 1
            }
            this.addOperator(data)
          } else {
            this.$message.error('请求出错')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message.error('请求出错')
        })
    },
    judgeIsConnect () {
      if (this.websock.readyState != 1) {
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
    findSessionByFriend (friend) {
      findSessionByFriend(friend).then(response => {
        if (response.data.code === 0) {
          this.selectSession(response.data.data)
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    initWebSocket () { // 初始化weosocket
      this.websock = this.websocketClient
    },
    async receiveMessage (redata) { // 数据接收
      if (redata.ws_message_notify_type === 2) {
        switch (redata.ws_message.ws_message_type) {
          case 0:
            switch (redata.ws_message.session_message.session_message_type) {
              case 1:
              case 2:
              case 3:
                var newMessage = redata.ws_message.session_message.message
                for (var i = 0; i < this.sessionDialogs.length; i++) {
                  if (this.sessionDialogs[i].session_id === newMessage.session_id) {
                    let currentSession = this.sessionDialogs[i]
                    currentSession.latest_message = newMessage
                    // this.sessions[i].latest_message = newMessage
                    // 接收到的消息发送者不是自己，并且当前面板的不是接收到消息的会话
                    if (newMessage.send.account_id !== this.user_id) {
                      if (this.messages.length === 0 || this.messages[0].session_id !== newMessage.session_id) {
                        // 该会话未读条数加1
                        currentSession.unread += 1
                      }
                    }
                    this.sessionDialogs.splice(i, 1)
                    this.sessionDialogs.unshift(currentSession)
                    break
                  }
                }
                if (this.session.session_id === newMessage.session_id) {
                    this.messages.push(newMessage)
                    this.scrollToBottom()
                }
            }
            break;
          case 4:
            this.user_inputting = {
              session_id: redata.ws_message.session_message.session.session_id,
              inputting: redata.ws_message.session_message.session.inputting
            }
            break;
          case 5:
          case 6:
          case 7:
                newMessage = redata.ws_message.session_message.message
                for (i = 0; i < this.sessionDialogs.length; i++) {
                  if (this.sessionDialogs[i].session_id === newMessage.session_id) {
                    let currentSession = this.sessionDialogs[i]
                    if (currentSession.latest_message.message_id == newMessage.message_id) {
                      if (currentSession.latest_message.send === sessionStorage.getItem('user_id')) {
                        currentSession.latest_message.content = '您撤回了一条消息'
                      } else {
                        currentSession.latest_message.content = newMessage.send.username + '撤回了一条消息'
                      }
                    }
                    this.sessionDialogs.splice(i, 1)
                    this.sessionDialogs.unshift(currentSession)
                    break
                  }
                }
                this.flushWithDrawnMessage(newMessage.message_id) 
                break
          case 100:
            this.videoVisible = true
            this.videoReceive = true
            this.videoNotify = '视频通话请求'
            this.inviteAccount = redata.ws_message.session_message.web_rtc.invite_account
            this.selectSession(redata.ws_message.session_message.session.session_id)
            break
          case 200:
            this.webRTCSession(false)
            await this.sleepTime(3000)
            if (!this.judgeIsConnect()) {
              return
            }
            var notify = {
              ws_message_notify_type: 2,
              ws_message: {
                ws_message_type: 600,
                session_message: {
                  session_message_type: 2,
                  session: {
                    session_id: this.session.session_id,
                  },
                  web_rtc: {}
                }
              }
            }
            notify.ws_message.session_message.web_rtc.invite_account = redata.ws_message.session_message.web_rtc.invite_account
            notify.ws_message.session_message.web_rtc.remote_sdp = this.remoteSession
            this.websocketsend(JSON.stringify(notify))
            this.videoNotify = '通话进行中'
            this.hangupVisible = true
            // this.videoVisible = false
            break
          case 301:
            this.$message.warning = '请求已超时'
            this.videoNotify = ''
            this.videoVisible = false
            break
          case 302:
            if (this.session.session_type === 0) {
              this.$message.warning = '对方已拒绝'
              this.videoNotify = ''
              this.videoVisible = false
            }
            break
          case 303:
            if (this.session.session_type === 0) {
              this.$message.warning = '对方已挂断'
              this.videoNotify = ''
              this.videoVisible = false
              this.hangupVisible = false
              this.localSession = ''
              this.localPC = null
              this.remoteSession = ''
              this.remotePC = null
            }
            break
          case 400:
            // 本地回执
            this.localPC.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(redata.ws_message.session_message.web_rtc.swap_sdp))))
            break;
          case 500:
            // 远程回执
            this.remotePC.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(redata.ws_message.session_message.web_rtc.remote_swap_sdp))))
        }
      }
    },
    websocketsend (Data) { // 数据发送
      this.websock.send(Data)
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
              message_type: this.send_form_type,
              content: this.send_form_content
            }
          }
        }
      }
      this.websocketsend(JSON.stringify(actions))
      this.send_form_type = 0
      this.send_form_content = ''
    },
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    handleCloseVideo (done) {
      this.$confirm('确认关闭？').then(e => {
        console.log(e)
        done();
      })
      .catch(e => {
        console.log(e)
      });
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
    getUserManage () {
      userManage().then(response => {
        if (response.data.code === 0) {
          this.userManage = response.data.data
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    updateUserManage () {
      console.log(this.userManage)
      updateUserManage(this.userManage).then(response => {
        if (response.data.code === 0) {
          this.$message.success('更新成功')
          this.getUserManage()
        } else {
          this.$message.error('更新失败')
        }
      })
        .catch(error => {
          console.log(error)
          this.$message.error('请求错误')
        })
    },
    imgClick (index) {
      this.send_form_content = 'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + index + '.gif'
      this.send_form_type = 2
      this.send()
    },
    getReadUsers (message) {
      getReadUsers(message).then(response => {
        if (response.data.code === 0) {
          this.message_read_users = response.data.data
        }
        console.log(this.messageReadUsers)
      }).catch(error => {
        console.log(error)
      })
    },
    flushWithDrawnMessage (message_id) {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].message_id === message_id) {
          let message = this.messages[i]
          message.content = ''
          message.message_type = 3
          this.messages.splice(i, 1, message)
        }
      }
    },
    flushDeleteMessage (message_id) {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].message_id === message_id) {
          this.messages.splice(i, 1)
        }
      } 
    },
    deleteMessage (message) {
      deleteMessage(message).then(response => {
        if (response.data.code === 0) {
          this.flushDeleteMessage(message.message_id)
        } else {
          this.$message.error('删除失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    withDrawnMessage (message) {
      withDrawnMessage(message).then(response => {
        if (response.data.code === 0) {
          this.flushWithDrawnMessage(message.message_id)
          this.$message.success('撤回成功')
        } else {
          this.$message.error('撤回失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    flushMessage (session) {
      flushMessage(session).then(response => {
        if (response.data.code === 0) {
          this.messages = []
          this.$message.error('清空成功')
        } else {
          this.$message.error('清空失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
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

.read-total-number {
  display: inline-block;
  border-radius: 18px;
  width: 10px;
  height: 10px;
  border: 1px solid gray;
  line-height: 1;
  font-size: 12px;
  text-align: center;
}
</style>
