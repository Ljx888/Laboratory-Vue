import axios from 'axios';
import {Notification, Message, MessageBox } from 'element-ui';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    // response => {
    //     if (response.status === 200) {
    //         return response.data;
    //     } else {
    //         Promise.reject();
    //     }
    // },
    // error => {
    //     console.log(error);
    //     return Promise.reject();
    // }
    res => {
        const code = res.data.code
        if(code === 401){
            MessageBox.confirm(
                '登录状态已过期, 你可以继续留在该页面, 或者重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {

            })
        } else if (code !== 200) {
            Notification.error({
                title: res.data.msg
            })
            return Promise.reject('error')
        }else {
            return res.data
        }
    },
    error => {
        console.log('err' + error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
);

export default service;
