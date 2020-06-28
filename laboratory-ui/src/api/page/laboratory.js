import request from '@/utils/request'

export function listLab(query) {
    return request({
        url: 'http://localhost:8888/laboratory/list',
        method: 'get',
        params: query
    })
}

export function inputLab() {
    return request({
        url: 'http://localhost:8888/laboratory/input',
        method: 'get'
    })
}

export function getLab(laboratoryId) {
    return request({
        url: 'http://localhost:8888/laboratory/get?laboratoryId='+laboratoryId,
        method: 'get',
    })
}

export function addLab(data) {
    return request({
        url: 'http://localhost:8888/laboratory/add',
        method: 'post',
        data: data
    })
}

export function editLab(data) {
    return request({
        url: 'http://localhost:8888/laboratory/edit',
        method: 'put',
        data: data
    })
}

export function deleteLab(laboratoryId) {
    return request({
        url: 'http://localhost:8888/laboratory/del?laboratoryId='+laboratoryId,
        method: 'delete'
    })
}
