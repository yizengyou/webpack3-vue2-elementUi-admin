import Vue from 'vue' //引入vue
import Router from 'vue-router' //引入路由

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router) //使用路由

/* Layout */
import Layout from '../views/layout/Layout' //引入页面布局组件

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

//定义初始路由-不用异步挂载
export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        meta: {
            title: '首页'
        },
        hidden: true, //是否在导航中显示
        children: [{
            path: 'dashboard',
            meta: {
                title: '首页'
            },
            component: () => import('@/views/dashboard/index')
        }]
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}), //路由滚动行为-默认路由切换滚动到y=0
    routes: constantRouterMap //路由配置-初始挂载无权限限制的路由
})

//定义异步挂载路由
export const asyncRouterMap = [
    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        meta: {
            title: '数据', //导航名
            icon: 'example' //图标icon
        },
        children: [
            {
                path: 'table',
                name: 'Table',
                component: () => import('@/views/table/index'),
                meta: {title: '表格', icon: 'table'}
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () => import('@/views/tree/index'),
                meta: {title: '树型图', icon: 'tree', roles: ['admin']}
            },
            {
                path: 'my_table',
                name: 'my_table',
                component: () => import('@/views/table/table'),
                meta: {title: '表格综合', icon: 'table'}
            }
        ]
    },

    {
        path: '/form',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Form',
                component: () => import('@/views/form/index'),
                meta: {
                    title: '表单',
                    icon: 'form'
                }
            }
        ]
    },

    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]
