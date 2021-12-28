import axios from 'axios'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('token')
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

export default service