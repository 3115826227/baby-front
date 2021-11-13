<template>
    <div id='login'>
        <el-card id="login-panel" v-if="register === false">
            <div id="header">
                <label>宝宝煎米果</label>
            </div>
            <div>
                <el-form :model="login_form" :ref="login_form" label-width="80px">
                    <el-form-item label="用户名: ">
                        <el-input type="text" v-model="login_form.login_name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="密码: ">
                        <el-input type="password" v-model="login_form.password" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" id='submit'>
                        <el-button type="primary" @click="handleLogin">登陆</el-button>
                        <el-button type="primary" @click="toRegister">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card id="register-panel" v-else="">
            <div id="header">
                <label>宝宝煎米果</label>
            </div>
            <div>
                <el-form :model="register_form" :ref="register_form" label-width="80px">
                    <el-form-item label="用户名: ">
                        <el-input type="text" v-model="register_form.login_name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="昵称: ">
                        <el-input type="text" v-model="register_form.username" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="密码: ">
                        <el-input type="password" v-model="register_form.password" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码: ">
                        <el-input type="password" v-model="register_form.repassword" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="手机号: ">
                        <el-input type="phone" v-model="register_form.phone" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" id='submit'>
                        <el-button type="primary" @click="toLogin">登陆</el-button>
                        <el-button type="primary" @click="handleRegister">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card id="illustrate">
            <div>
                <label><p>Golang微服务系统 <span style="font-size:12px;color:gray">当前版本：0.1.2</span></p></label>
            </div>
            <el-collapse v-model="activeNames" style="">
                <el-collapse-item title="即时通信" name="1">
                    <p style="margin-left:4%;color:gray">· 支持好友、讨论组、群管理</p>
                    <p style="margin-left:4%;color:gray">· 支持单聊、群聊，获取好友在线状态和编辑状态</p>
                    <p style="margin-left:4%;color:gray">· 支持表情包、图片、文件消息发送</p>
                    <p style="margin-left:4%;color:gray">· 支持消息撤回、获取已读回执</p>
                </el-collapse-item>
                <el-collapse-item title="空间动态" name="2">
                    <p style="margin-left:4%;color:gray">· 支持动态发布</p>
                    <p style="margin-left:4%;color:gray">· 支持动态评论</p>
                    <p style="margin-left:4%;color:gray">· 支持动态评论回复</p>
                </el-collapse-item>
                <el-collapse-item title="用户管理" name="3">
                    <p style="margin-left:4%;color:gray">· 支持头像上传</p>
                    <p style="margin-left:4%;color:gray">· 支持用户消息修改</p>
                    <p style="margin-left:4%;color:gray">· 支持用户签到、积分管理</p>
                </el-collapse-item>
            </el-collapse>
        </el-card>
        <div id="footer">
            <div>
                <a href="https://gitee.com/syu_fzh/baby-fried-rice" target="_blank">
                    <svg  width="27" height="27" aria-hidden="true" hidden="24" viewBox="0 0 2000 2000">
                    <path d="M898 1992q183 0 344-69.5t283-191.5q122-122 191.5-283t69.5-344q0-183-69.5-344T1525 477q-122-122-283-191.5T898 216q-184 0-345 69.5T270 477Q148 599 78.5 760T9 1104q0 183 69.5 344T270 1731q122 122 283 191.5t345 69.5zm199-400H448q-17 0-30.5-14t-13.5-30V932q0-89 43.5-163.5T565 649q74-45 166-45h616q17 0 30.5 14t13.5 31v111q0 16-13.5 30t-30.5 14H731q-54 0-93.5 39.5T598 937v422q0 17 14 30.5t30 13.5h416q55 0 94.5-39.5t39.5-93.5v-22q0-17-14-30.5t-31-13.5H842q-17 0-30.5-14t-13.5-31v-111q0-16 13.5-30t30.5-14h505q17 0 30.5 14t13.5 30v250q0 121-86.5 207.5T1097 1592z"/>
                </svg>
                </a>
                <a style="margin-left:1%" href="https://github.com/3115826227/baby-fried-rice" target="_blank">
                <svg aria-hidden="true" hidden="24" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                </a>
            </div>
            <div>
                Copyright © 2021 费朝晖 版权所有
            </div>
        </div>
    </div>
</template>

<script>
import { login, register } from '@/api/user'

export default {
    name: 'Login',
    data () {
        return {
            login_form: {
                login_name: '',
                password: ''
            },
            register_form: {},
            img_code: '',
            activeNames: ['1','2','3'],
            register: false
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            let register = localStorage.getItem('register')
            if (register == 'true') {
                this.register = true
            } else {
                this.register = false
            }
            console.log(register, this.register)
        },
        handleLogin () {
            login({ login_name: this.login_form.login_name, password: this.login_form.password }).then(response => {
                if (response.data.code === 0) {
                    sessionStorage.setItem('token', response.data.data.token)
                    sessionStorage.setItem('user_id', response.data.data.user_info.user_id)
                    sessionStorage.setItem('username', response.data.data.user_info.username)
                    this.$router.push({path: '/index'})
                } else {
                    console.log(response)
                    this.$message.error('密码或用户名错误')
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('请求错误')
            })
        },
        handleRegister () {
            var data = {
                login_name: this.register_form.login_name,
                password: this.register_form.password,
                username: this.register_form.username,
                phone: this.register_form.phone
            }
            register(data).then(response => {
                if (response.data.code === 0) {
                    this.$message.success('注册成功')
                    this.$router.push({path: '/'})
                } else {
                    this.$message.error('参数错误')
                }
            }).catch(error => {
                console.log(error)
                this.$message.error('请求错误')
            })
        },
        toLogin () {
            this.register = false;
            localStorage.setItem('register', false)
            this.register_form = {}
        },
        toRegister () {
          this.register = true
          localStorage.setItem('register', true)
          this.login_form = {}
        }
    }
}
</script>

<style scoped>
#login {
    background-color: #CCEEFF;
    height: 100%;
}
#login-panel {
  text-align: center;
  height: 35%;
  width: 25%;
  margin: 11% 0 0 15%;
  float: left;
  padding: 2%;
  border-radius: 10px;
  overflow: auto;
  /* background-color: #FFF;  */
}
#register-panel {
  text-align: center;
  height: 60%;
  width: 25%;
  margin: 6% 0 0 15%;
  float: left;
  padding: 2%;
  border-radius: 10px;
  overflow: auto;
  /* background-color: #FFF;  */
}
#illustrate {
    height: 67%;
    width: 30%;
    margin: 6% 8%;
    float: left;
    font-weight: 500px;
    overflow: auto;
    border-radius: 10px;
}
#header {
  text-align: center;
  font-size: 18px;
  font-weight: 500px;
  margin-bottom: 8%;
}
#submit {
  text-align: left;
}
#footer {
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 20px;
    font-size:13px;
}
</style>