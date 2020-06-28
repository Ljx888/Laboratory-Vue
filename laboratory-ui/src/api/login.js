import request from '@/utils/request'

// 登录方法
export function login(userId, password) {
    const data = {
        userId,
        password,
    }
    return request({
        url: 'http://localhost:8888/login',
        method: 'post',
        data: data
    })
}

export function persons(personId, password) {
    const data = {
        personId,
        password,
    }
    return request({
        url: 'http://localhost:8888/person',
        method: 'post',
        data: data
    })
}
