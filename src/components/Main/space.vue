<template>
    <div id="space">
        <div id="space-content">
            <el-form id="space-form" ref="space_form" :model="space_form">
              <el-form-item class="space-form-item" label="">
                <el-input type="textarea" rows="5" v-model="space_form.content" placeholder="说说你的心情吧"></el-input>
              </el-form-item>
              <el-form-item class="space-form-item"  label="">
                <el-col :span="20">
                  <el-select class="space-form-visit-select" v-model="space_form.visitor_type" placeholder="请选择可见范围">
                    <el-option label="公开" value="0"></el-option>
                    <el-option label="仅好友可见" value="1"></el-option>
                    <el-option label="私密" value="4"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" class="space-form-button">
                   <el-button type="primary" size="small" @click="addSpace">
                     <i class="iconfont">&#xe648;</i>
                     <span>发表</span>
                  </el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <div id="space-label">
              <el-row>
                <el-col :span="10">
                  <el-button type="info" size="small" @click="getSpaces">
                    <i class="iconfont">&#xe71f;</i>
                    <span>点击刷新</span>
                  </el-button>
                </el-col>
                <el-col :span="14" style="text-align:right;">
                  <span>动态筛选：</span>
                  <el-select v-model="space_type" placeholder="">
                    <el-option label="所有" value="1"></el-option>
                    <el-option label="只看认证用户" value="2"></el-option>
                    <el-option label="只看校内用户" value="3"></el-option>
                    <el-option label="只看好友" value="4"></el-option>
                    <el-option label="只看私密" value="5"></el-option>
                  </el-select>
                </el-col>
                <!-- <el-col :span="4" style="text-align:right;"><span>点击刷新</span></el-col> -->
              </el-row>
            </div>
            <!-- <div class="new-space-notify" v-if="new_space_number">
               <span>您有{{new_space_number}}条新动态！！！</span>
            </div> -->
            <div id="space-user">
              <ul class="space-user-ul">
                <li v-for="item in spaces" :key="item.id">
                  <el-row>
                    <el-col :span="2" style="font-weight:500">
                      <span v-if="item.origin.remark">{{item.origin.remark}}</span>
                      <span v-else>{{item.origin.username}}</span>
                    </el-col>
                    <el-col :span="6" style="font-size:12px;">
                      <span v-if="item.verify" class="verify"><i><strong>V</strong></i> 已认证</span>
                      <span v-else class="unverify">未认证</span>
                    </el-col>
                  </el-row>
                  <el-row style="color:gray;font-size:14px;line-height:20px;">
                    <el-col :span="12">
                      <span v-if="item.friend">好友 ·</span>
                      <!-- <span>邵阳学院 ·</span> -->
                      <span>{{timestampToTime(item.create_time)}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">{{item.content}}</el-col>
                  </el-row>
                  <el-row v-for="(data, index) in item.images" :key="index">
                    <img :src="data">
                  </el-row>
                  <el-row style="color:gray;font-size:14px;line-height:25px;">
                    <el-col :span="16" style="color:gray;">
                      <i class="iconfont">&#xe61d; </i>
                      <span>浏览{{item.visit_total}}次</span>
                    </el-col>
                    <el-col :span="4">
                      <i class="iconfont">&#xe60a; </i>
                      <span v-if="!item.origin_liked">
                        <span><a @click="addSpaceOpt(item.id, 1)">点赞 </a></span>
                      </span>
                      <span v-else="">
                        <span><a @click="addSpaceOpt(item.id, 2)">取消点赞 </a></span>
                      </span>
                      <span>{{item.like_total}}</span>
                    </el-col>
                    <el-col :span="4">
                      <i class="iconfont">&#xe6d3; </i>
                      <span><a @click="item.open_comment = !item.open_comment">评论</a> </span>
                      <span>{{item.comment_total}}</span>
                    </el-col>
                  </el-row>
                  <el-card v-if="item.open_comment === true" style="margin-top:2%">
                    <div v-if="item.comment_total">
                      <span style="font-weight:500">{{item.comment_total}}条评论</span>
                      <HR SIZE=1 />
                    </div>
                    <div v-for="comment in item.comments" :key="comment.id">
                      <el-row>
                        <el-col :span="3" style="font-weight:500">
                          {{comment.origin.username}}
                        </el-col>
                      </el-row>
                      <el-row>
                        {{comment.content}}
                      </el-row>
                      <el-row>
                        <el-col :span="2" style="font-size:13px">
                          <span v-if="!comment.origin_liked">
                            <i class="iconfont" @click="addCommentOpt(item.id, comment.id, 1)">&#xe60a; </i>
                          </span>
                          <span v-else="">
                            <i class="iconfont" @click="addCommentOpt(item.id, comment.id, 2)" style="color:#175199">&#xe60a; </i>
                          </span>
                          <span v-if="comment.like_total">{{comment.like_total}}</span>
                        </el-col>
                        <el-col :span="2">
                          <span style="font-size:13px;color:gray"><a @click="comment.open_reply = !comment.open_reply">回复 {{comment.reply_total}}</a></span>
                        </el-col>
                      </el-row>
                      <div v-if="comment.open_reply" style="margin-left:7%">
                        <HR SIZE=1 />
                        <div v-for="reply in comment.reply" :key="reply.id">
                          <el-row>
                            <el-col :span="3" style="font-weight:500">
                              {{reply.origin.username}}
                            </el-col>
                          </el-row>
                          <div>
                            {{reply.content}}
                          </div>
                          <el-row>
                            <el-col :span="2" style="font-size:13px">
                              <span v-if="!reply.origin_liked">
                                <i class="iconfont" @click="addCommentOpt(item.id, reply.id, 1)">&#xe60a; </i>
                              </span>
                              <span v-else="">
                                <i class="iconfont" @click="addCommentOpt(item.id, reply.id, 2)" style="color:#175199">&#xe60a; </i>
                              </span>
                              <span v-if="reply.like_total">{{reply.like_total}}</span>
                            </el-col>
                            <el-col :span="2">
                              <span style="font-size:13px;color:gray" @click="reply.open_comment = !reply.open_comment">回复</span>
                            </el-col>
                          </el-row>
                          <HR SIZE=1 />
                        </div>
                        <el-row>
                          <el-col :span="21">
                            <el-input type="text" size="mini" v-model="reply_form.content" placeholder="回复一下什么吧"></el-input>
                          </el-col>
                          <el-col :span="3" style="text-align:right">
                            <el-button type="primary" size="mini" @click="addReply(item.id, comment.id)">发布</el-button>
                          </el-col>
                        </el-row>
                      </div>
                      <HR SIZE=1 />
                    </div>
                    <el-row v-if="item.open_comment === true">
                      <el-col :span="21">
                        <el-input type="text" size="mini" v-model="comment_form.content" placeholder="评论些什么吧"></el-input>
                      </el-col>
                      <el-col :span="3" style="text-align:right">
                        <el-button type="primary" size="mini" @click="addComment(item.id)">发布</el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </li>
              </ul>
              <div class="visit-message">
                <span>{{visit_message}}</span>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSpaces, addSpace, addOperator, addComment } from '@/api/space'

export default {
  name: 'space',
  data () {
    return {
      space_form: {
        visitor_type: '0'
      },
      visit_message: '没有更多啦',
      space_type: '1',
      new_space_number: 2,
      spaces: [],
      space_user: [],
      comment_form: {},
      reply_form: {}
    }
  },
  created () {
    this.getSpaces()
  },
  methods: {
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
    getSpaces () {
      var req = {
        page: 1,
        pageSize: 10
      }
      getSpaces(req).then(response => {
          if (response.data.code === 0) {
            this.spaces = response.data.data.list
          } else {
            this.$message.error('请求失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('请求出错')
        })
    },
    addSpace () {
      var data = {
        content: this.space_form.content,
        visitor_type: parseInt(this.space_form.visitor_type)
      }
      addSpace(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('发表成功')
          this.space_form = {}
          this.getSpaces()
        } else {
          this.$message.error('发表失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addComment (id) {
      var data = {
        space_id: id,
        comment: this.comment_form.content
      }
      addComment(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('发表成功')
          this.comment_form = {}
          this.getSpaces()
        } else {
          this.$message.error('发表失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addReply (space_id, parent_id) {
      var data = {
        space_id: space_id,
        parent_id: parent_id,
        comment: this.reply_form.content
      }
      addComment(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('发表成功')
          this.reply_form = {}
          this.getSpaces()
        } else {
          this.$message.error('发表失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addCommentOpt (space_id, comment_id, opt_type) {
      var data = {
        operator_id: comment_id,
        space_id: space_id,
        operator_type: opt_type
      }
      addOperator(data).then(response => {
        if (response.data.code === 0) {
          this.getSpaces()
        } else {
          this.$message.error('请求失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addSpaceOpt(id, opt_type) {
      var data = {
        operator_id: id,
        space_id: id,
        operator_type: opt_type
      }
      addOperator(data).then(response => {
        if (response.data.code === 0) {
          this.getSpaces()
        } else {
          this.$message.error('请求失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    }
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
#space {
  /* background-color: #ede8d1; */
  border-radius: 5px;
  /* margin: 20px; */
  margin: 20px 0px 0px 0px;
  padding-bottom: 30px;
  height: 100%;
}
#space-content {
  margin: 0 18%;
  padding: 0 10%;
  height: 100%;
  /* border: 1px #666; */
  /* border-style: none solid none solid; */
  /* background-color: #ede8d1; */
}
#space-form {
  padding: 0px;
  /* background-color: white; */
}
#space-label {
  /* background-color: #fff; */
  padding: 10px 0px;
  border-radius: 5px;
  height: 50px;
}
.space-form-item {
  line-height: 0px;
}
.space-form-visit-select {
  width: 35%;
}
.space-form-button {
  text-align: right;
}
.space-user {
  margin-bottom: 20px;
  scroll-behavior: auto;
}
.space-user-ul {
  /* background-color: #ede8d1; */
  /* margin-top: 10px; */
  /* margin-bottom: 10px; */
  line-height: 30px;
  list-style-type:none;
  padding-inline-start:0px;
}
.space-user-ul li {
  border-radius: 5px;
  color: #2e3135;
  font-size: 16px;
  font-weight: 400;
  background-color: #fff;
  padding: 10px 20px;
  margin-bottom: 20px;
}
.visit-message {
  text-align: center;
}
.el-input--suffix .el-input__inner {
  height: 33px;
}
.verify {
  background-color: #efc100;
  color: white;
  font-size: 10px;
  border-radius: 5px;
  padding: 2px;
}
.unverify {
  background-color: grey;
  color: white;
  border-radius: 5px;
  padding: 5px;
}
.new-space-notify {
  padding-top:9px;
  color:#D92E2E;
  font-size:16px;
  font-weight:400px;
  text-align:center;
}
</style>
