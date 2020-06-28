import request from '@/utils/request'

export function listPerson(query) {
    return request({
        url: 'http://localhost:8888/person/list',
        method: 'get',
        params: query
    })
}
export function input(userId) {
    return request({
        url: 'http://localhost:8888/person/input?userId='+userId,
        method: 'get',
    })
}

export function addPerson(data) {
    return request({
        url: 'http://localhost:8888/person/add',
        method: 'post',
        data: data
    })
}

export function getPerson(personId) {
    return request({
        url: 'http://localhost:8888/person/get?personId='+personId,
        method: 'get',
    })
}

export function editPerson(data) {
    return request({
        url: 'http://localhost:8888/person/edit',
        method: 'put',
        data: data
    })
}

export function deletePerson(personId) {
    return request({
        url: 'http://localhost:8888/person/del?personId='+personId,
        method: 'delete',
    })
}

export function deleteAll(personId) {
    return request({
        url: 'http://localhost:8888/person/delAll?personId='+personId,
        method: 'delete',
    })
}
