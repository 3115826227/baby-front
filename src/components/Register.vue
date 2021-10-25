<template>
    <div id="register">
        <div class="name">
          宝宝煎米果
        </div>
        <AliCaptcha></AliCaptcha>
        <el-form :model="form" label-width="20%">
          <el-form-item label="用户名">
              <el-input type="text" v-model="form.login_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="昵称">
              <el-input type="text" v-model="form.username" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="密码">
              <el-input type="password" v-model="form.password" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="重复密码">
              <el-input type="password" v-model="form.repassword" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="手机号">
              <el-input type="phone" v-model="form.phone" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" id="submit">
             <el-button type="primary" @click="login">登录</el-button>
             <el-button type="primary" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { register } from '@/api/user'

export default {
  name: 'register',
  components: {
  },
  data () {
    return {
      form: {
        gender: '男'
      },
    }
  },
  methods: {
    login () {
      this.$router.push({path: '/'})
    },
    register () {
      // var that = this
      var genderFlag = false
      if (this.form.gender === '男') {
        genderFlag = true
      }
      var data = {
        login_name: this.form.login_name,
        password: this.form.password,
        username: this.form.username,
        gender: genderFlag,
        phone: this.form.phone
      }
      register(data).then(response => {
        if (response.data.code === 0) {
            this.$message.success('注册成功')
            this.$router.push({path: '/'})
          } else {
            this.$message.error('请求错误')
          }
      }).catch(error => {
        console.log(error)
        this.$message.error('请求错误')
      })
    }
  }
}
</script>

<style scoped>
#register {
  margin: 5% 35% 5% 30%;
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
</style>
