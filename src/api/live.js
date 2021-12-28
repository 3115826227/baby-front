import request from '@/utils/request'

export function getLive(req) {
    return request({
        url: '/live/room?page=' + req.page + '&page_size=' + req.page_size,
        method: 'get'
    })
}


export function updateOriginLive(data) {
    return request({
        url: '/live/room/origin',
        method: 'post',
        data
    })
}

export function updateUserOpt(data) {
    return request({
        url: '/live/room/user/opt',
        method: 'post',
        data
    })
}