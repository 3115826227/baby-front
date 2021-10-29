import request from '@/utils/request'

export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

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

export function updateDetail(data) {
    return request({
        url: '/account/user/detail',
        method: 'patch',
        data
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

export function signinlog() {
    return request({
        url: 'account/user/sign_in/log?day=1',
        method: 'get'
    })
}

export function coinlog() {
    return request({
        url: 'account/user/coin/log',
        method: 'get'
    })
}

export function addCommunication(data) {
    return request({
        url: 'account/user/communication',
        method: 'post',
        data
    })
}

export function getCommunications(req) {
    return request({
        url: 'account/user/communication?page=' + req.page + '&page_size=' + req.pageSize,
        method: 'get'
    })
}

export function getCommunicationDetail(id) {
    return request({
        url: 'account/user/communication/detail?id=' + id,
        method: 'get'
    })
}

export function getVersions() {
    return request({
        url: 'account/user/iter/version',
        method: 'get'
    })
}