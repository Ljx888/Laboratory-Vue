import request from '@/utils/request'

export function listEnroll(query) {
    return request({
        url: 'http://localhost:8888/enroll/list',
        method: 'get',
        params: query
    })
}

export function listTc(query) {
    return request({
        url: 'http://localhost:8888/enroll/listTc',
        method: 'get',
        params: query
    })
}

export function editStatus(id, status) {
    return request({
        url: 'http://localhost:8888/enroll/editStatus?id='+id+'&status='+status,
        method: 'put',
    })
}

export function getEnroll(id) {
    return request({
        url: 'http://localhost:8888/enroll/get?id='+id,
        method: 'get',
    })
}

export function addEnroll(data) {
    return request({
        url: 'http://localhost:8888/enroll/add',
        method: 'post',
        data: data
    })
}

export function editEnroll(data) {
    return request({
        url: 'http://localhost:8888/enroll/edit',
        method: 'put',
        data: data
    })
}

export function deleteEnroll(id) {
    return request({
        url: 'http://localhost:8888/enroll/del?id='+id,
        method: 'delete'
    })
}
