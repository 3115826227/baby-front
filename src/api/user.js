import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function detail() {
    return request({
        url: '/account/user/detail',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/account/user/logout',
        method: 'get'
    })
}

export function query(id) {
    return request({
        url: '/account/user/query?account_id=' + id,
        method: 'get'
    })
}