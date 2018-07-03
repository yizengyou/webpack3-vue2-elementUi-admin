import {login, logout, getInfo} from '@/api/login' //引入接口
import {getToken, setToken, removeToken} from '@/utils/auth' //引入操作token公用方法

const user = {
    state: {
        token: getToken(), //初始化获得token
        name: '', //用户名
        avatar: '', //头像
        roles: [] //权限数组
    },

    mutations: {
        //设置token
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        //设置用户名
        SET_NAME: (state, name) => {
            state.name = name
        },
        //设置
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        //设置路由
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            //去除用户名的前后空格
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.data
                    setToken(data.token)
                    //登录成功设置token
                    commit('SET_TOKEN', data.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data
                    if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', data.roles)
                    } else {
                        reject('getInfo: roles must be a not-null array !')
                    }
                    commit('SET_NAME', data.name) //设置用户名
                    commit('SET_AVATAR', data.avatar) //设置头像
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    //登出，清空数据
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                //清除数据
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
