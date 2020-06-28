import request from '@/utils/request'

export function listWork(query) {
    return request({
        url: 'http://localhost:8888/work/list',
        method: 'get',
        params: query
    })
}

export function addWork(data) {
    return request({
        url: 'http://localhost:8888/work/add',
        method: 'post',
        data: data
    })
}

export function getWork(id) {
    return request({
        url: 'http://localhost:8888/work/get?id='+id,
        method: 'get',
    })
}

export function editWork(data) {
    return request({
        url: 'http://localhost:8888/work/edit',
        method: 'put',
        data: data
    })
}

export function deleteWork(id) {
    return request({
        url: 'http://localhost:8888/work/del?id='+id,
        method: 'delete',
    })
}

export function deleteAll(id) {
    return request({
        url: 'http://localhost:8888/work/delAll?id='+id,
        method: 'delete',
    })
}
