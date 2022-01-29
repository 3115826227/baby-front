<template>
    <div id="space">
        <div id="space-content">
            <div v-if="!spaceEditorVisitor" style="text-align:right">
              <el-button size="small" type="primary" @click="spaceEditorVisitor = true">我要发表新动态</el-button>
            </div>
            <div id="space-editor" v-else="">
                <el-form id="space-form" ref="space_form" :model="space_form">
                  <el-form-item class="space-form-item" label="">
                    <el-input type="textarea" rows="5" v-model="space_form.content" placeholder="说说你的心情吧"></el-input>
                    <div style="margin-top:2%;">
                      <el-upload ref="upload_image" action="#" :limit="9" :auto-upload="false" list-type="picture-card" :on-exceed="fileExceed">
                      <i class="el-icon-picture-outline" style="font-size:18px;color:gray"></i> <span style="color:gray;font-size:14px;">图片</span>
                    </el-upload>
                    </div>
                  </el-form-item>
                  <el-form-item class="space-form-item"  label="可见范围">
                    <el-col :span="12" style="margin-right:1.5%;">
                      <el-select class="space-form-visit-select" v-model="space_form.visitor_type" size="small" placeholder="请选择可见范围">
                        <el-option label="公开" value="0"></el-option>
                        <el-option label="仅好友可见" value="1"></el-option>
                        <el-option label="私密" value="4"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="9" class="space-form-button" style="text-align:right;">
                      <span style="padding-right:4%;">
                        <el-checkbox label="匿名" v-model="space_form.anonymity" style="font-weight:340"></el-checkbox>
                      </span>
                      <el-button type="success" size="small" @click="addSpace">
                        <span>发表</span>
                      </el-button>
                      <el-button type="primary" size="small" @click="spaceEditorVisitor = false">
                        <span>收起</span>
                      </el-button>
                    </el-col>
                  </el-form-item>
              </el-form>
              <el-divider></el-divider>
            </div>
            <div id="space-user" v-infinite-scroll="load" style="height:100%;overflow:auto;margin-top:3%;">
                <div v-for="(item, index) in spaces" :key="item.id" style="background-color:white;padding:3%;margin-bottom:3%;">
                    <el-row>
                      <el-col :span="2">
                        <el-avatar size="medium" v-if="item.anonymity"><span style="font-size:12px;font-weight:500;">匿名</span></el-avatar>
                        <el-avatar size="medium" :src="item.origin.head_img_url" v-else=""></el-avatar>
                      </el-col>
                      <el-col :span="22">
                        <div>
                          <el-row>
                            <el-col :span="20" style="font-weight:500;">
                              <div v-if="item.anonymity">
                                <span>匿名用户</span>
                              </div>
                               <div v-else="">
                                  <span v-if="item.origin.remark">{{item.origin.remark}}</span>
                                  <span v-else>{{item.origin.username}}</span>
                                </div>
                            </el-col>
                            <el-col :span="4" v-if="item.origin_space || item.origin && item.origin.account_id === detail.account_id" style="text-align:right;">
                              <el-dropdown>
                                <span class="el-dropdown-link" style="font-size:16px;font-weight:600;">
                                  ···
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item><div @click="deleteSpace(index)">删除动态</div></el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </el-col>
                          </el-row>
                          <el-row style="color:gray;font-size:13px;line-height:20px;">
                            <el-col :span="12">
                              <span>{{timestampToTime(item.create_time)}}</span>
                            </el-col>
                          </el-row>
                          <div style="margin-top:1%;">
                            <div>
                              {{item.content}}
                            </div>
                            <div v-if="item.images === null || item.images === undefined || item.images.length !== 0" style="margin-top:1%;">
                              <el-row style="text-align:left;margin-right:10%;">
                                <el-col :span="7" v-for="(data, index) in item.images" :key="index" style="margin-right:1%;">
                                  <img :src="data" width="100%" height="150px" style="border-radius:5px;">
                                </el-col>
                              </el-row>
                            </div>
                          </div>
                          <el-row style="margin-top:2%;font-size:14px;">
                            <el-col :span="8">
                              <span v-if="!item.origin_liked">
                                <i class="iconfont">&#xe60a; </i>
                                <span style="padding-right:2%;"><a @click="addSpaceOpt(index, 1)">点赞</a></span>
                                <span v-if="item.like_total">{{item.like_total}}</span>
                              </span>
                              <span v-else="" style="color:#409EFF">
                                <i class="iconfont">&#xe60a; </i>
                                <span style="padding-right:3%;"><a @click="addSpaceOpt(index, 2)">取消点赞</a></span>
                                <span v-if="item.like_total">{{item.like_total}}</span>
                              </span>
                            </el-col>
                            <el-col :span="8" style="line-height:25px;">
                              <span style="padding-right:3%;"><i class="el-icon-chat-line-round"></i></span>
                              <span v-if="!item.open_comment"><a @click="item.open_comment = !item.open_comment">评论</a></span>
                              <span v-else=""><a @click="item.open_comment = !item.open_comment">收起评论</a></span>
                              <span v-if="item.comment_total" style="padding-left:2%;">{{item.comment_total}}</span>
                            </el-col>
                            <el-col :span="8" style="line-height:26px;">
                              <i class="iconfont">&#xe641; </i>
                              <span style="padding-right:3%;"><a @click="$message.warning('暂不支持转发，该功能还未开放')">转发</a></span>
                              <span v-if="item.forward_total">{{item.forward_total}}</span>
                            </el-col>
                          </el-row>
                          <div v-if="item.open_comment">
                            <div v-for="(comment, comment_index) in item.comments" :key="comment.id" style="padding-top:2%;">
                              <el-row>
                                <el-col :span="2">
                                  <el-avatar size="medium" :src="comment.origin.head_img_url"></el-avatar>
                                </el-col>
                                <el-col :span="22">
                                  <div style="font-size:14px;">
                                    <el-row>
                                      <el-col :span="20">
                                        <div style="font-weight:400;">
                                          <el-row>
                                            <el-col :span="18">
                                              <span v-if="comment.origin.remark">{{comment.origin.remark}}</span>
                                              <span v-else>{{comment.origin.username}}</span>
                                              <span style="padding-left:2%;color:gray;">{{comment.floor}}楼</span>
                                            </el-col>
                                            <el-col :span="2" style="font-size:13px;line-height:20px;color:gray">
                                                <span v-if="!comment.origin_liked">
                                                  <i class="iconfont" @click="addCommentOpt(index, comment_index, 1)">&#xe60a;</i>
                                                  <span v-if="comment.like_total">{{comment.like_total}}</span>
                                                </span>
                                                <span v-else="" style="color:#409EFF"> 
                                                  <i class="iconfont" @click="addCommentOpt(index, comment_index, 2)">&#xe60a;</i>
                                                  <span v-if="comment.like_total">{{comment.like_total}}</span>
                                                </span>
                                            </el-col>
                                            <el-col :span="4" style="line-height:22px;font-size:13px;color:gray">
                                              <span style="margin-right:3%;"><i class="el-icon-chat-line-round"></i></span>
                                              <span><a @click="comment.open_reply = !comment.open_reply">回复</a></span>
                                              <span v-if="comment.reply_total" style="padding-left: 2%;">{{comment.reply_total}}</span>
                                            </el-col>
                                          </el-row>
                                        </div>
                                        <div style="color:gray;font-size:13px;line-height:20px;">
                                          <span>{{timestampToTime(comment.create_time)}}</span>
                                        </div>
                                        <div style="margin-top:1%;">
                                          <span>{{comment.content}}</span>
                                        </div>
                                        <div v-if="comment.open_reply" style="padding:4%;margin-right:6%;margin-top:2%;background-color:#e5e6eb;border-radius:8px;">
                                          <div v-for="(reply, reply_index) in comment.reply" :key="reply.id" style="margin-top:2%;">
                                            <el-row>
                                              <el-col :span="2">
                                                <el-avatar size="medium" :src="reply.origin.head_img_url"></el-avatar>
                                              </el-col>
                                              <el-col :span="22" style="padding-left:3%;">
                                                <el-row>
                                                  <el-col :span="21">
                                                    <div style="font-weight:400;">
                                                      <span v-if="reply.origin.remark">{{reply.origin.remark}}</span>
                                                      <span v-else>{{reply.origin.username}}</span>
                                                    </div>
                                                    <div style="color:gray;font-size:13px;line-height:20px;">
                                                      <span>{{timestampToTime(reply.create_time)}}</span>
                                                    </div>
                                                    <div style="margin-top:1%;">
                                                      <span>{{reply.content}}</span>
                                                    </div>
                                                  </el-col>
                                                  <el-col :span="3" style="text-align:right;color:gray">
                                                    <span v-if="!reply.origin_liked">
                                                      <i class="iconfont" @click="addReplyOpt(index, comment_index,  reply_index, 1)">&#xe60a;</i>
                                                      <span v-if="reply.like_total">{{reply.like_total}}</span>
                                                    </span>
                                                    <span v-else="" style="color:#409EFF"> 
                                                      <i class="iconfont" @click="addReplyOpt(index, comment_index, reply_index, 2)">&#xe60a;</i>
                                                      <span v-if="reply.like_total">{{reply.like_total}}</span>
                                                    </span>
                                                  </el-col>
                                                </el-row>
                                              </el-col>
                                            </el-row>
                                          </div>
                                          <div style="margin-top:2%;text-align:right;" @click="getReply(index, comment_index)">
                                            <el-pagination
                                              small 
                                              hide-on-single-page
                                              layout="total, prev, next"
                                              @current-change="handleCurrentReplyChange"
                                              :page-size="current_reply_page_size"
                                              :current-page="comment.current_reply_page"
                                              :total="comment.reply_total">
                                            </el-pagination>
                                          </div>
                                          <el-row style="margin-top:2%;">
                                              <el-col :span="19">
                                                <el-input size="mini" v-model="comment.reply_content" placeholder="回复一下"></el-input>
                                              </el-col>
                                              <el-col :span="5" style="text-align:right">
                                                <el-button type="primary" size="mini" @click="addReply(index, comment_index, comment.reply_content)">发送</el-button>
                                              </el-col>
                                            </el-row>
                                        </div>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>
                            <div style="margin-top:2%;margin-right:10%;text-align:right;" @click="getComments(index)">
                              <el-pagination
                                small 
                                hide-on-single-page
                                layout="total, prev, next"
                                @current-change="handleCurrentCommentChange"
                                :page-size="current_comment_page_size"
                                :current-page="item.current_comment_page"
                                :total="item.floor_total">
                              </el-pagination>
                            </div>
                            <div style="margin-top:2%;margin-right:2%;">
                              <el-row>
                                <el-col :span="22" style="padding-right:2%;">
                                  <el-input size="small" v-model="item.comment_content" placeholder="我来说一说"></el-input>
                                </el-col>
                                <el-col :span="2">
                                  <el-button type="primary" size="small" @click="addComment(index, item.comment_content)">发送</el-button>
                                </el-col>
                              </el-row>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                </div>
              <div v-if="noMoreSpace" style="text-align:center;font-size:14px;color:gray;margin:4% 0;">
                没有更多动态了
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSpaces, addSpace, deleteSpace, addOperator, addComment, getComment, getReply } from '@/api/space'
import { upload } from '@/api/file'

export default {
  name: 'space',
  props: ['detail'],
  data () {
    return {
      space_form: {
        visitor_type: '0',
      },
      space_images: [],
      visit_message: '没有更多啦',
      space_type: '0',
      new_space_number: 2,
      spaces: [],
      space_user: [],
      comment_form: {},
      reply_form: {},
      user_id: '',
      current_page: 1,
      current_pageSize: 10,
      isRefreshBool: true,
      spaceEditorVisitor: false, 
      noMoreSpace: false,
      current_comment_page: 1,
      current_comment_page_size: 5,
      current_reply_page: 1,
      current_reply_page_size: 4
    }
  },
  created () {
    this.init()
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
      var now = new Date(Date.parse(new Date()))
      var nowYear = now.getFullYear()
      var nowMonth = now.getMonth() + 1
      var nowDay = now.getDate()
      var str = ''
      if (nowYear !== y) {
        str = y + '-'
      }
      if (m !== nowMonth || d !== nowDay) {
        str = this.add0(m) + '-' + this.add0(d) + ' '
      }
      return str + this.add0(h) + ':' + this.add0(mm)
    },
    init () {
      this.getSpaces()
    },
    load () {
      console.log('load')
      this.refeshSpace()
    },
    refeshSpace () {
      if (this.noMoreSpace) {
        // this.$message.warning('没有更多消息了')
        return
      }
      this.current_page += 1
      this.getMoreSpaces()
    },
    getMoreSpaces () {
      var req = {
        page: this.current_page,
        pageSize: this.current_pageSize,
        visitor_type: this.space_type
      }
      getSpaces(req).then(response => {
          if (response.data.code === 0) {
            if (response.data.data.list.length < this.current_pageSize) {
              this.noMoreSpace = true
            }
            response.data.data.list.forEach(e => {
              e.reply_content = ''
              this.spaces.push(e)
            });
          } else {
            this.$message.error('请求失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('请求出错')
        })
    },
    getSpaces () {
      var req = {
        page: this.current_page,
        pageSize: this.current_pageSize,
        visitor_type: this.space_type
      }
      getSpaces(req).then(response => {
          if (response.data.code === 0) {
            this.spaces = []
            response.data.data.list.forEach(e => {
              e.page_size = this.current_comment_page_size
              this.spaces.push(e)
            })
          } else {
            this.$message.error('请求失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('请求出错')
        })
    },
    async addSpace () {
      await this.uploadFile()
      let data = {
        content: this.space_form.content,
        images: this.space_images,
        visitor_type: parseInt(this.space_form.visitor_type),
        anonymity: this.space_form.anonymity
      }
      addSpace(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('发表成功')
          this.space_form = {}
          this.space_images = []
          this.spaceEditorVisitor = false
          let now = Date.parse(new Date())/1000
          let currentSpace = {
            id: response.data.data,
            content: data.content,
            images: data.images,
            visitor_type: data.visitor_type,
            create_time: now,
            anonymity: data.anonymity,
            comments: []
          }
          if (!data.anonymity) {
            currentSpace.origin = {
              account_id: this.detail.account_id,
              head_img_url: this.detail.head_img_url,
              username: this.detail.username
            }
          }
          this.spaces.unshift(currentSpace)
        } else {
          this.$message.error('发表失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    async fowardSpace () {

    },
    addComment (index, content) {
      let id = this.spaces[index].id
      var data = {
        biz_id: id,
        biz_type: 1,
        comment: content
      }
      addComment(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('发表成功')
          this.comment_form = {}
          let currentSpace = this.spaces[index]
          currentSpace.comment_total += 1
          var now = Date.parse(new Date())/1000
          currentSpace.floor_total += 1
          currentSpace.comments.push({
            id: response.data.data,
            content: content,
            origin: {
              account_id: this.detail.account_id,
              head_img_url: this.detail.head_img_url,
              username: this.detail.username
            },
            create_time: now,
            like_total: 0,
            origin_liked: false,
            open_reply: false,    
            reply: [],
            floor: currentSpace.floor_total
          })
          currentSpace.comment_content = ''
          this.spaces.splice(index, 1, currentSpace)
        } else {
          this.$message.error('发表失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addReply (space_index, comment_index, reply_content) {
      let space_id = this.spaces[space_index].id
      let comment_id = this.spaces[space_index].comments[comment_index].id
      var data = {
        biz_id: space_id,
        biz_type: 1,
        parent_id: comment_id,
        comment: reply_content
      }
      addComment(data).then(response => {
        if (response.data.code === 0) {
          this.$message.success('发表成功')
          let currentSpace = this.spaces[space_index]
          let currentComment = currentSpace.comments[comment_index]
          currentComment.reply_content = ''
          let now =  Date.parse(new Date())/1000
          let currentReply = {
            id: response.data.data,
            content: reply_content,
            origin: {
              account_id: this.detail.account_id,
              head_img_url: this.detail.head_img_url,
              username: this.detail.username
            },
            create_time: now,
            like_total: 0,
            origin_liked: false
          }
          currentComment.reply_total += 1
          currentComment.reply.unshift(currentReply)
          currentSpace.comments.splice(comment_index, 1, currentComment)
          this.spaces.splice(space_index, 1, currentSpace)
        } else {
          this.$message.error('发表失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addReplyOpt (space_index, comment_index, reply_index, opt_type) {
      let space_id = this.spaces[space_index].id
      let reply_id = this.spaces[space_index].comments[comment_index].reply[reply_index].id
      var data = {
        operator_id: reply_id,
        biz_id: space_id,
        biz_type: 1,
        operator_type: opt_type
      }
      addOperator(data).then(response => {
        if (response.data.code === 0) {
          let currentSpace = this.spaces[space_index]
          let currentComment = currentSpace.comments[comment_index]
          let currentReply = currentComment.reply[reply_index]
          if (!currentReply.origin_liked) {
            currentReply.like_total += 1
          } else {
            currentReply.like_total -= 1
          }
          currentReply.origin_liked = !currentReply.origin_liked
          currentComment.reply.splice(reply_index, 1, currentReply)
          currentSpace.comments.splice(comment_index, 1, currentComment)
          this.spaces.splice(space_index, 1, currentSpace)
        } else {
          this.$message.error('请求失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addCommentOpt (space_index, comment_index, opt_type) {
      let space_id = this.spaces[space_index].id
      let comment_id = this.spaces[space_index].comments[comment_index].id
      var data = {
        operator_id: comment_id,
        biz_id: space_id,
        biz_type: 1,
        operator_type: opt_type
      }
      addOperator(data).then(response => {
        if (response.data.code === 0) {
          let currentSpace = this.spaces[space_index]
          let currentComment = currentSpace.comments[comment_index]
          if (!currentComment.origin_liked) {
            currentComment.like_total += 1
          } else {
            currentComment.like_total -= 1
          }
          currentComment.origin_liked = !currentComment.origin_liked
          currentSpace.comments.splice(comment_index, 1, currentComment)
          this.spaces.splice(space_index, 1, currentSpace)
        } else {
          this.$message.error('请求失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    addSpaceOpt(index, opt_type) {
      let id = this.spaces[index].id
      var data = {
        operator_id: id,
        biz_id: id,
        biz_type: 1,
        operator_type: opt_type
      }
      addOperator(data).then(response => {
        if (response.data.code === 0) {
          let currentSpace = this.spaces[index]
          if (!currentSpace.origin_liked) {
            currentSpace.like_total += 1
          } else {
            currentSpace.like_total -= 1
          }
          currentSpace.origin_liked = !currentSpace.origin_liked
          this.spaces.splice(index, 1, currentSpace)
        } else {
          this.$message.error('请求失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    async uploadData (data) {
      await upload(data).then(response => {
        if (response.data.code === 0) {
          this.space_images[this.space_images.length] = response.data.data.down_url
        } else {
          this.$message.error('上传失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求错误')
      })
    },
    async uploadFile () {
      var files = this.$refs.upload_image.$data.uploadFiles
      for (var i = 0;  i < files.length; i++) {
        var data = new FormData();
        data.append('file', files[i].raw);
        await this.uploadData(data)
      }
    },
    fileExceed () {
      this.$message.warning('最多只能上传9张图片')
    },
    deleteSpace (index) {
      let id = this.spaces[index].id
      deleteSpace(id).then(response => {
        if (response.data.code === 0) {
          this.spaces.splice(index, 1)
        } else {
          this.$message.error('请求失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    handleCurrentCommentChange (current_page) {
      this.current_comment_page = current_page
    },
    handleCurrentReplyChange (current_page) {
      this.current_reply_page = current_page
      console.log(this.current_reply_page)
    },
    getComments (index) {
      if (this.current_comment_page === this.spaces[index].current_comment_page) {
        return
      }
      console.log(index, this.current_comment_page, this.spaces[index].current_comment_page)
      var req = {
        biz_id: this.spaces[index].id,
        biz_type: 1,
        page: this.current_comment_page,
        pageSize: this.current_comment_page_size
      }
      getComment(req).then(response => {
        if (response.data.code === 0) {
          let space = this.spaces[index]
          space.comments = response.data.data.list
          space.current_comment_page = this.current_comment_page
          this.spaces.splice(index, 1, space)
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求出错')
      })
    },
    getReply (index, comment_index) {
      if ( this.current_reply_page === this.spaces[index].comments[comment_index].current_reply_page) {
        return
      }
      console.log(index, comment_index, this.current_reply_page)
      var req = {
        biz_id: this.spaces[index].id,
        biz_type: 1,
        floor: this.spaces[index].comments[comment_index].floor,
        page: this.current_reply_page,
        pageSize: this.current_reply_page_size
      }
      getReply(req).then(response => {
        if (response.data.code === 0) {
          let space = this.spaces[index]
          let comment = space.comments[comment_index]
          comment.reply = response.data.data.list
          comment.current_reply_page = this.current_reply_page
          space.comments.splice(comment_index, 1, comment)
          this.spaces.splice(index, 1, space)
        } else {
          this.$message.error(response.data.message)
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
@font-face {
  font-family: 'iconfont';  /* Project id 3151840 */
  src: url('//at.alicdn.com/t/font_3151840_iympewdfmcl.woff2?t=1642754929752') format('woff2'),
       url('//at.alicdn.com/t/font_3151840_iympewdfmcl.woff?t=1642754929752') format('woff'),
       url('//at.alicdn.com/t/font_3151840_iympewdfmcl.ttf?t=1642754929752') format('truetype');
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
