import axios from 'axios'
import router from '@/router'

let instance = axios.create({
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  baseURL: 'http://localhost:8070/api',
  timeout: 5000
})

// http request 拦截器
instance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token')
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.authorization = token // 请求头加上token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
instance.interceptors.response.use(
  response => {
    console.log(response.data)
    if (response.data.code) {
      switch (response.data.code) {
        case 1002:
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
      }
    }
    return response
  },
  // 接口错误状态处理，也就是说无响应时的处理
  error => {
    return Promise.reject(error.response.status) // 返回接口返回的错误信息
  }
)

export default instance
