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

export function getComment(req) {
    return request({
        url: '/comment/comment?' + 'page=' + req.page + '&page_size=' + req.pageSize + '&biz_id=' + req.biz_id + '&biz_type=' + req.biz_type,
        method: 'get'
    })
}

export function getReply(req) {
    return request({
        url: '/comment/comment/reply?' + 'page=' + req.page + '&page_size=' + req.pageSize + '&biz_id=' + req.biz_id + '&biz_type=' + req.biz_type + '&floor=' + req.floor,
        method: 'get'
    })
}

export function deleteSpace(id) {
    return request({
        url: '/space/space?id=' + id,
        method: 'delete'
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