import request from '@/utils/request'

export function addSpace(data) {
    return request({
        url: '/space/space',
        method: 'post',
        data
    })
}

export function getSpaces(req) {
    return request({
        url: '/space/space?' + 'page=' + req.page + '&page_size=' + req.pageSize + '&visitor_type=' + req.visitor_type,
        method: 'get'
    })
}

export function addComment(data) {
    return request({
        url: '/comment/comment',
        method: 'post',
        data
    })
}

export function addOperator(data) {
    return request({
        url: '/comment/operator',
        method: 'post',
        data
    })
}