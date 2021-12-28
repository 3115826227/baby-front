import request from '@/utils/request'

export function getTag() {
    return request({
        url: '/blog/tag',
        method: 'get',
    })
}

export function getCategory() {
    return request({
        url: '/blog/category',
        method: 'get',
    })
}

export function getBlogger(req) {
    return request({
        url: '/blog/blogger?blogger=' + req.blogger,
        method: 'get'
    })
}


export function getBlog(req) {
    return request({
        url: '/blog/blog?query_type=' + req.query_type + '&page=' + req.page + '&page_size=' + req.page_size,
        method: 'get',
    })
}

export function getBlogDetail(req) {
    return request({
        url: '/blog/blog/detail?blog_id=' + req.blog_id,
        method: 'get',
    })
}

export function addTag(data) {
    return request({
        url: '/blog/tag',
        method: 'post',
        data
    })
}

export function delTag(tags) {
    return request({
        url: '/blog/tag?tags=' + tags,
        method: 'delete'
    })
}

export function addCategory(data) {
    return request({
        url: '/blog/category',
        method: 'post',
        data
    })
}

export function delCategory(category) {
    return request({
        url: '/blog/category?category=' + category,
        method: 'delete'
    })
}