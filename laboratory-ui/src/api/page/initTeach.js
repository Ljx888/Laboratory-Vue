import request from '@/utils/request'

export function listInitTeach(query) {
    return request({
        url: 'http://localhost:8888/initTeach/list',
        method: 'get',
        params: query
    })
}

export function getInitTeach(initTeachId) {
    return request({
        url: 'http://localhost:8888/initTeach/get?initTeachId='+initTeachId,
        method: 'get',
    })
}

export function addInitTeach(data) {
    return request({
        url: 'http://localhost:8888/initTeach/add',
        method: 'post',
        data: data
    })
}

export function editInitTeach(data) {
    return request({
        url: 'http://localhost:8888/initTeach/edit',
        method: 'put',
        data: data
    })
}

export function deleteInitTeach(initTeachId) {
    return request({
        url: 'http://localhost:8888/initTeach/del?initTeachId='+initTeachId,
        method: 'delete'
    })
}
