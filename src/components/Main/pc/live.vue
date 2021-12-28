<template>
    <div id="live" style="height:100%">
        <div id="left-list">
            <div style="margin-bottom:4%;">
                <el-button type="primary" style="width:100%" @click="live">我要直播</el-button>
            </div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>直播列表</span>
                </div>
                <div v-for="(item, index) in live_list" :key="item.id" :style="index !== 0 ? 'margin-top:8%':''">
                    <el-row>
                        <el-col :span="18">
                            <span>{{item.origin.username}}</span>
                        </el-col>
                        <el-col :span="4">
                            <el-button size="mini" type="primary" @click="enterLive(item)">进入</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
        <div id="content">
            <div id="live-panel">
                <div v-if="remoteVideoVisible">
                    <video id="remote-video" width="100%"></video>
                </div>
                <div v-else="">
                    <video id="local-video" width="100%"></video>
                </div>
            </div>
            <div id="live-list" v-if="current_live_room">
                <el-card class="box-card" style="height:75%">
                    <div slot="header" class="clearfix">
                        <span>{{current_live_room.origin.username}} 的直播间</span>
                    </div>
                    <div style="padding:0px">
                        <div id="message-panel" style="height:410px;border:1px solid #EBEEF5;margin-bottom:2%;">
                            <div v-if="messages" style="font-size:13px;color:gray;text-align:center">
                                <el-empty description="暂无消息"></el-empty>
                                <!-- <span>暂无消息</span> -->
                            </div>
                        </div>
                        <div style="margin:2%;">
                            <el-row>
                                <el-col :span="19">
                                    <el-input size="small" placeholder="说点什么吧"></el-input>
                                </el-col>
                                <el-col :span="3" style="margin-left:2%">
                                    <el-button size="small" type="primary">发送</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-card>
                <div style="text-align:right;margin-top:5%" v-if="current_live_room.origin.account_id === user_id">
                    <el-button type="danger">结束直播</el-button>
                </div>
                <div style="text-align:right;margin-top:5%" v-else="">
                    <el-button type="danger">退出直播间</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getLive, updateOriginLive, updateUserOpt } from '@/api/live'
var log = msg => {
  console.log(msg)
};
export default {
  name: 'live',
  data () {
      return {
          user_id: '',
          remoteVideoVisible: false,
          live_list: [],
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
          current_live_room: null,
          messages: []
      }
  },
  mounted() {
      this.init()
      this.getLive()
  },
  methods: {
      init () {
          this.user_id = localStorage.getItem('user_id')
      },
      getLive() {
          getLive({page:1,page_size:10}).then(response => {
              if (response.data.code === 0) {
                  this.live_list = response.data.data.list
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      async live() {
          this.webRTCSession(true, true)
          await this.sleepTime(3000)
          var data = {
              sdp: this.localSession,
              status: 1
          }
          updateOriginLive(data).then(response => {
              if (response.data.code === 0) {
                this.current_live_room = response.data.data.live_room
                this.localPC.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(response.data.data.swap_sdp))))
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      async enterLive(live_room) {
          this.current_live_room = live_room
          if (live_room.origin.account_id === this.user_id) {
              return
          }
          this.remoteVideoVisible = true
          this.webRTCSession(false, true)
          await this.sleepTime(3000)
          var data = {
              live_room_id: live_room.live_room_id,
              opt: 10,
              remote_sdp: this.remoteSession
          }
          updateUserOpt(data).then(response => {
              if (response.data.code === 0) {
                  this.remotePC.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(response.data.data.remote_swap_sdp))))
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      webRTCSession (isPublisher, video) {
      var that = this;
      let pc = new RTCPeerConnection({
          iceServers: [
              {
                  urls: 'stun:stun1.l.google.com:19302'
              }
          ]
      });
      pc.oniceconnectionstatechange = e => {
        log(e);
        log(pc.iceConnectionState);
      }
      if (isPublisher) {
          pc.onicecandidate = event => {
              if (event.candidate === null) {
                  that.localSession = btoa(JSON.stringify(pc.localDescription))
              }
          };
          if (!navigator.mediaDevices||
            !navigator.mediaDevices.getUserMedia) {
            this.$message.error("getUserMedia is not supported!")
            return;
          }
          navigator.mediaDevices.getUserMedia({video: video, audio: true})
              .then(stream => {
                  stream.getTracks().forEach(track => pc.addTrack(track, stream));
                  that.$nextTick(()=> {
                    if (video) {
                      document.getElementById('local-video').srcObject = stream;
                      document.getElementById('local-video').autoplay = true;
                    }
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
          if (video) {
            pc.addTransceiver('video')
          }
          pc.addTransceiver('audio')
          pc.createOffer()
              .then(d => pc.setLocalDescription(d))
              .catch(log);

          pc.ontrack = function (event) {
              that.$nextTick(()=> {
                if (video) {
                  if (event.track.kind === 'video') {
                    document.getElementById('remote-video').srcObject = event.streams[0];
                    document.getElementById('remote-video').autoplay = true
                  } else if (event.track.kind === 'audio') {
                    document.getElementById('remote-audio').srcObject = event.streams[0];
                  }
                } else {
                  document.getElementById('remote-audio').srcObject = event.streams[0];
                }
              })
          };
          that.remotePC = pc
      }
    },
    sleepTime (time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    }
  }
}
</script>

<style scoped>
#live {
    margin: 2%;
    height: 100%;
}
#left-list {
    float: left;
    width: 18%;
    margin-left: 3%;
    margin-right: 1%;
}
#content {
    float: left;
    width: 78%;
    height:  100%;
}
#live-panel {
    background-color: black;
    float: left;
    width: 70%;
    height: 81.6%;
    /* border-radius: 10px; */
}
#live-list {
    float: left;
    width: 28%;
    margin-left: 2%;
    height:  100%;
}
</style>