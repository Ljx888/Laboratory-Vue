import request from '@/utils/request'

export function listUser(query) {
    return request({
        url: 'http://localhost:8888/user/list',
        method: 'get',
        params: query
    })
}

export function getUser(id) {
    return request({
        url: 'http://localhost:8888/user/get?id='+id,
        method: 'get',
    })
}

export function addUser(data) {
    return request({
        url: 'http://localhost:8888/user/add',
        method: 'post',
        data: data
    })
}

export function editUser(data) {
    return request({
        url: 'http://localhost:8888/user/edit',
        method: 'put',
        data: data
    })
}

export function deleteUser(userId) {
    return request({
        url: 'http://localhost:8888/user/del?userId='+userId,
        method: 'delete'
    })
}

export function deleteUserAll(userId) {
    return request({
        url: 'http://localhost:8888/user/delAll?userId='+userId,
        method: 'delete'
    })
}
