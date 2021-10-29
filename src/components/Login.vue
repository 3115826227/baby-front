<template>
    <div id='login'>
        <div class="name">
          宝宝煎米果
        </div>
        <el-form :model="form" :ref="form" label-width="70px">
          <el-form-item label="用户名">
              <el-input type="text" v-model="form.login_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="密码">
              <el-input type="password" v-model="form.password" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="" id='submit'>
              <el-button type="primary" @click="handleLogin">登陆</el-button>
              <el-button type="primary" @click="toRegister">注册</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { login } from '@/api/user'

export default {
    name: 'Login',
    data () {
        return {
            form: {
                login_name: '',
                password: ''
            },
            img_code: ''
        }
    },
    methods: {
        handleLogin () {
            login({ login_name: this.form.login_name, password: this.form.password }).then(response => {
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
        toRegister () {
          this.$router.push({path: '/register'})
        }
    }
}
</script>

<style scoped>
#login {
  margin: 13% 35% 5% 30%;
  padding: 5%;
  border-radius: 10px;
  background-color: #E9EEF3;
}
.name {
  text-align: center;
  font-size: 20px;
  margin: 10px;
  font-weight: inherit;
  margin-bottom: 50px;
}
#submit {
  text-align: left;
}
</style>