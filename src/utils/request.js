import axios from 'axios' //引用ajax组件
import {Message, MessageBox} from 'element-ui' //单独引用element-ui的提示框
import store from '../store' //引用状态管理对象
import {getToken} from '@/utils/auth' //引用工具
/*import qs from 'qs';*/

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000 // 请求超时时间
})

//配置请求发出前拦截器
service.interceptors.request.use(config => {
    //从状态管理中获取token
    if (store.getters.token) {
        config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    //请求增加时间戳-去除缓存
    config.params = Object.assign(config.params || {}, {
        _: +new Date()
    })

    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// 配置响应拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data //取得响应数据
        if (res.code !== 20000) {
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            })

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //前端退出登录
                    store.dispatch('FedLogOut').then(() => {
                        //重新加载页面-等于用户刷新
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error)// for debug
        //5秒消失提示
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
