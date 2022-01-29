<template>
    <div id="communication">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="反馈列表" name="list">
                <div id="list">
                    <el-card v-for="item in communications" :key="item.id" style="margin-bottom:1.5%">
                        <el-row>
                            <el-col :span="22">
                                <span style="margin-right:1%">
                                    <el-tag type="success" size="small" v-if="item.communication_type === 1" effect="dark">建议</el-tag>
                                    <el-tag type="warning" size="small" v-else-if="item.communication_type === 2" effect="dark">问题</el-tag>
                                    <el-tag type="danger" size="small" v-else-if="item.communication_type === 3" effect="dark">缺陷</el-tag>
                                </span>
                                <span>{{item.title}}</span>
                            </el-col>
                            <el-col :span="2" style="text-align:right">
                                <el-button type="primary" size="mini" @click="getCommunicationDetail(item.id)">详情</el-button>
                                <!-- <el-button type="danger" size="mini" @click="deleteCommunication(item.id)">删除</el-button> -->
                            </el-col>
                        </el-row>
                    </el-card>
                    <div style="text-align:right;margin-top:2%;">
                        <el-pagination
                        background
                        layout="total, sizes, prev, pager, next"
                        :page-size="pageSize"
                        :total="communication_total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="新增反馈" name="add">
                <el-form :model="communication_form" label-width="80px">
                    <el-form-item label="类型：">
                        <el-select v-model="communication_form.communication_type" placeholder="请选择反馈类型">
                        <el-option label="建议" value="1"></el-option>
                        <el-option label="问题" value="2"></el-option>
                        <el-option label="缺陷" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题：">
                        <el-input v-model="communication_form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容：">
                        <el-input type="textarea" v-model="communication_form.content" rows="12"></el-input>
                    </el-form-item>
                    <el-form-item class="space-form-item" label="">
                      <el-upload ref="upload_image" action="#" :limit="9" :auto-upload="false" list-type="picture-card" :on-exceed="fileExceed">
                        <i class="el-icon-picture-outline" style="font-size:18px;color:gray"></i> <span style="color:gray;font-size:14px;">图片</span>
                      </el-upload>
                  </el-form-item>
                </el-form>
                <div style="text-align:right">
                    <el-button type="primary" @click="addCommunication">提交</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="反馈详情" :visible.sync="communicationVisible">
            <el-form>
                <el-form-item label="标题：">
                    <span style="font-weight:500;padding-right:1%;">{{current_communication.title}}</span>
                    <span>
                        <el-tag type="success" size="small" v-if="current_communication.communication_type === 1" effect="dark">建议</el-tag>
                        <el-tag type="warning" size="small" v-else-if="current_communication.communication_type === 2" effect="dark">问题</el-tag>
                        <el-tag type="danger" size="small" v-else-if="current_communication.communication_type === 3" effect="dark">缺陷</el-tag>
                    </span>
                </el-form-item>
                <el-form-item label="时间：">
                    <span style="color:gray">{{timestampToTime(current_communication.create_timestamp)}}</span>
                </el-form-item>
                <el-form-item label="内容：">
                    <p style="white-space: pre-line;padding-left:6%;margin-top:0;margin-bottom:0;">{{current_communication.content}}</p>
                </el-form-item>
                <el-form-item v-if="current_communication.images && current_communication.images.length" label="图片：">
                    <el-row style="margin-top:1.4%;">
                        <el-col :span="8" v-for="img in current_communication.images" :key="img">
                            <el-image :src="img" style="width:240px;height:240px" fit="fill"></el-image>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div v-if="current_communication.origin.account_id = detail.account_id" style="text-align:right">
                <el-button type="danger" size="small" @click="deleteCommunication(current_communication.id)">删除反馈</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {addCommunication, getCommunications, getCommunicationDetail, deleteCommunication} from '@/api/user.js';
import { upload } from '@/api/file'

export default {
  name: 'communication',
  props: ['detail'],
  data () {
      return {
        activeName: 'list',
        communications: [],
        communication_form: {
            images: []
        },
        current_index: 0,
        current_status: false,
        current_communication: {
            origin: {}
        },
        communication: {},
        communicationVisible: false,
        page: 1,
        pageSize: 10,
        communication_total: 0,
        upload_image: []
      }
  },
  created() {
      this.getCommunication()
  },
  methods: {
      handleClick () {

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
      getCommunication () {
          var data = {
              page: this.page,
              pageSize: this.pageSize
          }
          getCommunications(data).then((response) => {
              if (response.data.code === 0) {
                this.communications = response.data.data.list
                this.communication_total = response.data.data.total
              } else {
                this.$message.error('请求错误')
              }
          }).catch((err) => {
              console.log(err)
              this.$message.error('请求失败')
          });
      },
      async addCommunication () {
          await this.uploadFile()
          console.log(this.communication_form.images)
          var data = {
              title: this.communication_form.title,
              communication_type: parseInt(this.communication_form.communication_type),
              content: this.communication_form.content,
              images: this.communication_form.images
          }
          addCommunication(data).then(response => {
              if (response.data.code === 0) {
                this.$message.success('添加成功')
                this.communication_form = {}
                this.getCommunication()
              } else {
                this.$message.error('请求错误')
              }
          }).catch((err) => {
              console.log(err)
              this.$message.error('请求失败')
          });
      },
      getCommunicationDetail (id) {
          getCommunicationDetail(id).then(response => {
              if (response.data.code === 0) {
                  this.current_communication = response.data.data
                  this.communicationVisible = true
              } else {
                  this.$message.error(response.data.message)
              }
          }).catch((err) => {
              console.log(err)
              this.$message.error('请求失败')
          });
      },
      async uploadData (data) {
        await upload(data).then(response => {
            if (response.data.code === 0) {
            this.communication_form.images[this.communication_form.images.length] = response.data.data.down_url
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
        this.$refs.upload_image.$data.uploadFiles = []
      },
      fileExceed () {
        this.$message.warning('最多只能上传9张图片')
      },
      deleteCommunication (id) {
            deleteCommunication(id).then(response => {
              if (response.data.code === 0) {
                  this.communicationVisible = false
                  this.getCommunication()
                  this.$message.success('删除成功')
              } else {
                  this.$message.error(response.data.message)
              }
          }).catch((err) => {
              console.log(err)
              this.$message.error('请求失败')
          });
      }
  }
}
</script>

<style>
#communication {
    margin: 2% 18%;
}
</style>