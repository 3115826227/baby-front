<template>
    <div id="communication">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="反馈列表" name="list">
                <div id="list">
                    <el-card v-for="(item, index) in communications" :key="item.id" style="margin-bottom:1.5%">
                        <el-row>
                            <el-col :span="22">
                                <span style="margin-right:1%">
                                    <el-tag type="success" size="small" v-if="item.communication_type === 1" effect="dark">建议</el-tag>
                                    <el-tag type="warning" size="small" v-else-if="item.communication_type === 2" effect="dark">问题</el-tag>
                                    <el-tag type="danger" size="small" v-else-if="item.communication_type === 3" effect="dark">缺陷</el-tag>
                                </span>
                                <span>{{item.title}}</span>
                                <span style="margin-left:1%">
                                    <i class="el-icon-remove-outline" style="color:gray" v-if="!item.reply"></i>
                                    <i class="el-icon-circle-check" style="color:green" v-else=""></i>
                                </span>
                            </el-col>
                            <el-col :span="2" style="text-align:right">
                                <span v-if="index === current_index && current_status" @click="handleOpenClick(index, false)">
                                    <i class="el-icon-arrow-up"></i>
                                </span>
                                <span v-else="" @click="handleOpenClick(index, true)">
                                    <i class="el-icon-arrow-down"></i>
                                </span>
                            </el-col>
                        </el-row>
                        <div style="margin: 2% 0% 0% 6%;color:gray;font-size:14px;" v-if="index == current_index && current_status">
                            <div>
                                {{current_communication.content}}
                            </div>
                            <div style="margin-top:1%;margin-right:4%;font-size:13px;text-align:right">
                                {{timestampToTime(current_communication.create_timestamp)}}
                            </div>
                        </div>
                    </el-card>
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
                        <el-input type="textarea" v-model="communication_form.content" rows="18"></el-input>
                    </el-form-item>
                </el-form>
                <div style="text-align:right">
                    <el-button type="primary" @click="addCommunication">提交</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {addCommunication, getCommunications, getCommunicationDetail} from '@/api/user.js';
export default {
  name: 'communication',
  data () {
      return {
        activeName: 'list',
        communications: [],
        communication_form: {},
        current_index: 0,
        current_status: false,
        current_communication: {},
        page: 1,
        pageSize: 10
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
      handleOpenClick (index, status) {
          this.current_index = index
          this.current_status = status
          if (status) {
              this.getCommunicationDetail(this.communications[index].id)
          }
      },
      getCommunication () {
          var data = {
              page: this.page,
              pageSize: this.pageSize
          }
          getCommunications(data).then((response) => {
              if (response.data.code === 0) {
                this.communications = response.data.data.list
              } else {
                this.$message.error('请求错误')
              }
          }).catch((err) => {
              console.log(err)
              this.$message.error('请求失败')
          });
      },
      addCommunication () {
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
              } else {
                  this.$message.error('请求错误')
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