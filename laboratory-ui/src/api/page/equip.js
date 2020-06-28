import request from '@/utils/request'

export function listEquip(query) {
    return request({
        url: 'http://localhost:8888/equip/list',
        method: 'get',
        params: query
    })
}

export function inputEquip() {
    return request({
        url: 'http://localhost:8888/equip/input',
        method: 'get'
    })
}

export function getEquip(equipId) {
    return request({
        url: 'http://localhost:8888/equip/get?equipId='+equipId,
        method: 'get',
    })
}

export function addEquip(data) {
    return request({
        url: 'http://localhost:8888/equip/add',
        method: 'post',
        data: data
    })
}

export function editEquip(data) {
    return request({
        url: 'http://localhost:8888/equip/edit',
        method: 'put',
        data: data
    })
}

export function deleteEquip(equipId) {
    return request({
        url: 'http://localhost:8888/equip/del?equipId='+equipId,
        method: 'delete'
    })
}

export function delAll(equipId) {
    return request({
        url: 'http://localhost:8888/equip/delAll?equipId='+equipId,
        method: 'delete'
    })
}
