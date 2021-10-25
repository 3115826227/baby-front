import request from '@/utils/request'

export function addSession(data) {
    return request({
        url: '/im/session',
        method: 'post',
        data
    })
}


export function session() {
    return request({
        url: '/im/session',
        method: 'get'
    })
}

export function sessionDetail(id) {
    return request({
        url: '/im/session/detail?session_id=' + id,
        method: 'get'
    })
}

export function sessionMessages(req) {
    return request({
        url: '/im/session/message?session_id=' + req.session_id + '&page=' + req.page + '&page_size=' + req.page_size,
        method: 'get'
    })
}

export function readstatus(id) {
    return request({
        url: '/im/session/message/read_status?session_id=' + id,
        method: 'get'
    })
}

export function addFriend(data) {
    return request({
        url: '/im/session/friend',
        method: 'post',
        data
    })
}

export function friends() {
    return request({
        url: '/im/session/friend',
        method: 'get'
    })
}

export function operators() {
    return request({
        url: '/im/session/operator',
        method: 'get'
    })
}

export function deleteOpt(id) {
    return request({
        url: '/im/session/operator?operator_id=' + id,
        method: 'delete'
    })
}

export function createWebRTC(data) {
    return request({
        url: 'im/session/webrtc',
        method: 'post',
        data
    })
}