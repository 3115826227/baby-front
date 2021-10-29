<template>
    <div id="user">
        <div id="left-nav">
            <div id="header" @click="headimg_dialog_visible = true;img_url = detail.head_img_url">
                <el-avatar :src="detail.head_img_url" :size="150" fit="fit"></el-avatar>
            </div>
            <div id="signin">
                <template v-if="signin_status">
                    <label style="color:gray;font-size:13px">今日已签到</label>
                </template>
                <template v-else="">
                    <el-button type="danger" size="small" round>签到领积分</el-button>
                </template>
            </div>
            <div id="nav">
                <el-menu :default-active="active_index"  class="el-menu-vertical-demo" @select="handleSelect">
                 <!-- background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"> -->
                    <el-menu-item index="1">
                        <span slot="title">基本信息</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title">积分记录</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
        <div id="right-panel">
          <template v-if="active_index === '1'">
              <div id="panel-title">
                <el-row>
                    <el-col :span="11">
                        <span>基本信息</span>
                    </el-col>
                    <el-col :span="12" style="text-align:right;" v-if="!edit">
                        <el-link style="font-size:15px;" :underline="false" type="danger" @click="edit = true;gender = detail.gender.toString()">编辑</el-link>
                    </el-col>
                </el-row>
            </div>
            <el-divider></el-divider>
            <div id="panel-content">
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>账号：</label>
                    </el-col>
                    <el-col :span="12">
                        <label>{{detail.account_id}}</label>
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>昵称：</label>
                    </el-col>
                    <el-col :span="12">
                        <span v-if="edit">
                            <el-input v-model="detail_form.username" size="small" :placeholder="detail.username"></el-input>
                        </span>
                        <span v-else="">
                            <label>{{detail.username}}</label>
                        </span>
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>密码：</label>
                    </el-col>
                    <el-col :span="12">
                        ******&nbsp;&nbsp;&nbsp;
                        <template @click="getPwd"><el-link icon="el-icon-view" :underline="false">查看密码</el-link></template>
                        &nbsp;&nbsp;
                        <template @click="updatePwd"><el-link icon="el-icon-edit" :underline="false">修改密码</el-link></template>
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>性别：</label>
                    </el-col>
                    <el-col :span="12">
                        <span v-if="edit">
                            <el-select size="small" v-model="gender">
                                <el-option label="男" value="1"></el-option>
                                <el-option label="女" value="2"></el-option>
                            </el-select>
                        </span>
                        <span v-else="">
                            <template v-if="detail.gender === 1">男</template>
                            <template v-else="">女</template>
                        </span>
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>年龄：</label>
                    </el-col>
                    <el-col :span="12">
                        <span v-if="edit">
                            <el-input v-model.number="detail_form.age" size="small" :placeholder="detail.age"></el-input>
                        </span>
                        <span v-else="">
                            <label>{{detail.age}}</label>
                        </span>
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>手机号：</label>
                    </el-col>
                    <el-col :span="12">
                        <span v-if="edit">
                            <el-input v-model="detail_form.phone" size="small" :placeholder="detail.phone"></el-input>
                        </span>
                        <span v-else="">
                            <label>{{detail.phone}}</label>
                        </span>
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>积分：</label>
                    </el-col>
                    <el-col :span="12">
                        {{detail.coin}}
                    </el-col>
                </el-row>
                <el-row class="panel-content-item">
                    <el-col :span="4">
                        <label>简介：</label>
                    </el-col>
                    <el-col :span="12">
                        <span v-if="edit">
                            <el-input type="textarea" v-model="detail_form.describe" size="small" :placeholder="detail.describe" rows="6"></el-input>
                        </span>
                        <span v-else="">
                            <template v-if="detail.describe === ''">这个人很懒，什么也没有写</template>
                            <template v-else="">{{detail.describe}}</template>
                        </span>
                    </el-col>
                </el-row>
                <div style="text-align:right" v-if="edit">
                    <el-button type="primary" @click="updateUserDetail">保存</el-button>
                </div>
            </div>
          </template>
          <template v-else-if="active_index === '2'">
              <el-table :data="coin_logs" border>
                  <el-table-column prop="describe" label="描述">
                  </el-table-column>
                  <el-table-column label="数量">
                      <template slot-scope="scope" v-if="scope.row.coin > 0">
                          <span style="color:red">{{scope.row.coin}}</span>
                      </template>
                      <template slot-scope="scope" v-else="">
                          <span style="color:green">{{scope.row.coin}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="时间">
                      <template slot-scope="scope">
                          <span>{{scope.row.time}}</span>
                      </template>
                  </el-table-column>
              </el-table>
          </template>
        </div>
        <el-dialog title="头像" :visible.sync="headimg_dialog_visible" width="30%" :before-close="headimgHandleClose">
            <div style="text-align:center">
                <el-avatar :src="img_url" :size="200" fit="fit"></el-avatar>
                <div style="margin-top:2%">
                <el-upload ref="upload" action="#" :auto-upload="false" :show-file-list="false" :on-change="handlePreview">
                    <el-button type="primary">更换头像</el-button>
                </el-upload>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadImage">上 传</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { upload } from '@/api/file.js';
import { detail, updateDetail, signinlog, coinlog } from '@/api/user.js';
import { timestampToTime } from '@/utils/utils.js' 
export default ({
    name: 'user',
    data () {
        return {
            detail: {},
            signin_status: false,
            active_index: '1',
            coin_logs: [],
            headimg_dialog_visible: false,
            img_url: '',
            edit: false,
            detail_form: {},
            gender: '',
            update: false
        }
    },
    created () {
        this.getDetail()
        this.getSignInLog()
        this.getCoinLog()
    },
    watch: {
        file_list (val, oldVal) {
            console.log(val, oldVal)
        },
        detail_form (val, oldVal) {
            console.log(val, oldVal)
            this.update = true
        },
        gender (val, oldVal) {
            console.log(val, oldVal)
            this.update = true
        }
    },
    methods: {
        getDetail() {
            if (!sessionStorage.getItem('token')) {
              window.location.href = '/'
            }
            this.detail = JSON.parse(sessionStorage.getItem('detail'))
        },
        getUpdatedDetail () {
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
        getSignInLog() {
            signinlog()
            .then(response => {
                if (response.data.code === 0) {
                    if (response.data.data.length !== 0) {
                        this.signin_status = true
                    }
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('请求错误')
            })
        },
        handleSelect (key, keyPath) {
            console.log(key, keyPath)
            this.active_index = key
        },
        getCoinLog() {
            coinlog()
            .then(response => {
                if (response.data.code === 0) {
                    this.coin_logs = response.data.data.list
                    this.coin_logs.forEach(element => {
                        element.time = timestampToTime(element.timestamp)
                    });
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('请求错误')
            })
        },
        getPwd () {
        },
        updatePwd () {
        },
        headimgHandleClose (done) {
            done()
        },
        handlePreview (file) {
            this.img_url = URL.createObjectURL(file.raw)
        },
        uploadImage () {
            let file = this.$refs.upload.$data.uploadFiles[0]
            this.img_url = URL.createObjectURL(file.raw)
            var data = new FormData();
            data.append('file', file.raw);
            upload(data).then(response => {
                console.log(response)
                if (response.data.code === 0) {
                    this.detail_form = this.detail
                    this.detail_form.head_img_url = response.data.data.down_url
                    this.updateUserDetail()
                } else {
                     this.$message.error('上传失败')
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('请求错误')
            })
        },
        updateUserDetail () {
            if (!this.update) {
                this.edit = false
                return
            }
            this.detail_form.gender = parseInt(this.gender)
            console.log(this.detail_form)
            updateDetail(this.detail_form).then(response => {
                if (response.data.code === 0) {
                    this.$message.success('更新成功')
                    this.headimg_dialog_visible = false
                    this.getUpdatedDetail()
                } else {
                    this.$message.error('更新失败')
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('请求错误')
            })
            this.edit = false
            this.update = false
        }
    }
})
</script>

<style scoped>
#user {
    margin: 3% 12%;
    height: 100%;
}
#left-nav {
    float: left;
    width: 20%;
    text-align: center;
}
#header {
    margin-bottom: 5%;
}
#nav {
    padding: 20% 10%;
}
#right-panel {
    float: left;
    width: 70%;
    padding: 1% 5%;
}
#panel-title {
    font-size: 20px;
}
#panel-content {
    padding: 0 5%;
    color: gray;
}
.panel-content-item {
    margin: 3% 0;
}
</style>