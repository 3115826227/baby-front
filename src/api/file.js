import request from '@/utils/request'

export function upload(data) {
    return request({
        url: '/file/upload',
        method: 'post',
        // headers: {
        //     'Content-Type': 'multipart/form-data;boundary',
        // },
        "mimeType": "multipart/form-data",
        data
    })
}