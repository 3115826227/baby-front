import request from '@/utils/request'

export function addSession(data) {
    return request({
        url: '/im/session',
        method: 'post',
        data
    })
}

export function updateSession (data) {
    return request({
        url: '/im/session',
        method: 'patch',
        data
    })
}

export function session() {
    return request({
        url: '/im/session',
        method: 'get'
    })
}

export function sessionDialog() {
    return request({
        url: 'im/session/dialog',
        method: 'get'
    })
}

export function deleteSessionDialog(session_id) {
    return request({
        url: 'im/session/dialog?session_id=' + session_id,
        method: 'delete'
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

export function singleMessageReadstatus(id, message_id, account_id) {
    return request({
        url: '/im/session/message/read_status/single?session_id=' + id + "&message_id=" + message_id + "&account_id=" + account_id,
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
        url: '/im/session/friends',
        method: 'get'
    })
}

export function findSessionByFriend(friend) {
    return request({
        url: '/im/session/friend?friend=' + friend,
        method: 'get'
    })
}

export function addOperator(data) {
    return request({
        url: '/im/session/operator',
        method: 'post',
        data
    })
}

export function confirmOperator (data) {
    return request({
        url: '/im/session/operator/confirm',
        method: 'patch',
        data
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

export function userManage() {
    return request({
        url: '/im/session/manage',
        method: 'get'
    })
}

export function updateUserManage(data) {
    return request({
        url: '/im/session/manage',
        method: 'patch',
        data
    })
}

export function getReadUsers(req) {
    return request({
        url: 'im/session/message/read_users?session_id=' + req.session_id + '&message_id=' + req.message_id,
        method: 'get'
    })
}

export function withDrawnMessage (req) {
    return request({
        url: 'im/session/message/with_drawn?session_id=' + req.session_id + '&message_id=' + req.message_id,
        method: 'get'
    })
}

export function deleteMessage (req) {
    return request({
        url: 'im/session/message?session_id=' + req.session_id + '&message_ids=' + req.message_id,
        method: 'delete'
    })
}
 
export function flushMessage (req) {
    return request({
        url: 'im/session/message/flush?session_id=' + req.session_id,
        method: 'delete'
    })
}

export function updateFriendRemark (data) {
    return request({
        url: '/im/session/friend/remark',
        method: 'patch',
        data
    })
}

export function updateFriendBlackList (data) {
    return request({
        url: '/im/session/friend/black_list',
        method: 'patch',
        data
    })
}

export function deleteFriend (friend) {
    return request({
        url: '/im/session/friend?friend=' + friend,
        method: 'delete',
    })
}

export function sendMessage (data) {
    return request({
        url: '/im/session/message',
        method: 'post',
        data
    })
}

export function getUserImgCollects(req) {
    return request({
        url: '/im/session/img/collect?' + '&page=' + req.page + '&page_size=' + req.page_size,
        method: 'get'
    })
}

export function addUserImgCollect(data) {
    return request({
        url: 'im/session/img/collect',
        method: 'post',
        data
    })
}

export function deleteUserImgCollect(img) {
    return request({
        url: 'im/session/img/collect?img=' + img,
        method: 'delete'
    })
}

export function removeUser(data) {
    return request({
        url: 'im/session/remove',
        method: 'post',
        data
    })
}

export function inviteUser(data) {
    return request({
        url: 'im/session/invite',
        method: 'post',
        data
    })
}

export function leaveSession(session_id) {
    return request({
        url: 'im/session/leave?session_id=' + session_id,
        method: 'get'
    })
}

export function deleteSession(session_id) {
    return request({
        url: 'im/session?session_id=' + session_id,
        method: 'delete'
    })
}