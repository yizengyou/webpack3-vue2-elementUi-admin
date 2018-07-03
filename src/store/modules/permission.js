//导入所有路由数据
import {asyncRouterMap, constantRouterMap} from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles 拥有的权限数组 例如：[admin,admin2] 用户有admin 和admin2的权限
 * @param route 路由对象
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        /*
        * some() 方法用于检测数组中的元素是否满足指定条件（函数提供）
        * 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。如果没有满足条件的元素，则返回false。
        * */
        return roles.some(role => route.meta.roles.indexOf(role) >= 0)
    } else {
        return true //有权限访问
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 异步路由配置数据
 * @param roles 用户权限数组
 */
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true //有权限访问
        }
        return false //没有权限访问
    })
    return accessedRouters //返回过滤之后的路由数组
}

const permission = {
    state: {
        routers: constantRouterMap, //最终的路由数组
        addRouters: [] //权限过滤之后的路由数组
    },
    mutations: {
        //设置路由数组
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers) //初始路由拼接上权限过滤之后的数组
        }
    },
    actions: {
        //根据权限，动态生成路由
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                //传入后台的权限配置数组
                const {roles} = data
                let accessedRouters
                //如果是管理员就不用过滤了
                if (roles.indexOf('admin') >= 0) {
                    accessedRouters = asyncRouterMap
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, roles) //权限过滤路由
                }
                //console.log(accessedRouters)
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
}

export default permission
