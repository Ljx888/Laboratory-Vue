import request from '@/utils/request'

export function listRecruit(query) {
    return request({
        url: 'http://localhost:8888/recruit/list',
        method: 'get',
        params: query
    })
}

export function input(recruitId, userId) {
    return request({
        url: 'http://localhost:8888/recruit/input?recruitId='+recruitId+'&userId='+userId,
        method: 'get',
    })
}

export function getRecruit(id) {
    return request({
        url: 'http://localhost:8888/recruit/get?id='+id,
        method: 'get',
    })
}

export function addRecruit(data) {
    return request({
        url: 'http://localhost:8888/recruit/add',
        method: 'post',
        data: data
    })
}

export function editRecruit(data) {
    return request({
        url: 'http://localhost:8888/recruit/edit',
        method: 'put',
        data: data
    })
}

export function editStatus(id, status) {
    return request({
        url: 'http://localhost:8888/recruit/editStatus?id='+id+'&status='+status,
        method: 'put'
    })
}

export function deleteRecruit(recruitId) {
    return request({
        url: 'http://localhost:8888/recruit/del?recruitId='+recruitId,
        method: 'delete'
    })
}

export function deleteRecruitAll(recruitId) {
    return request({
        url: 'http://localhost:8888/recruit/delAll?recruitId='+recruitId,
        method: 'delete'
    })
}
