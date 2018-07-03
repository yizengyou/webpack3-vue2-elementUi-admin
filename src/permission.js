import router from './router' //路由对象
import store from './store' //状态管理
import {Message} from 'element-ui' //element-ui提示框
import NProgress from 'nprogress' // progress bar 页面加载进度
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from '@/utils/auth' // getToken from cookie

NProgress.configure({showSpinner: false})// NProgress Configuration 页面加载进度配置

const whiteList = ['/login'] // 没有登录token也能访问的白名单列表

router.beforeEach((to, from, next) => {
    NProgress.start() // 开始加载页面
    if (getToken()) { // determine if there has token
        //有登录token
        if (to.path === '/login') {//有登录，还去访问登录页，直接定向到首页
            next({path: '/'})
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            //当前用的权限配置是空的，需要拉取权限数据（初次登录时，一定是空的,每次刷新页面会重新生成路由）
            if (store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(res => { // 拉取用户信息-包括权限配置
                    //console.log(res.data.roles)
                    const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
                    //根据权限生成路由
                    store.dispatch('GenerateRoutes', {roles}).then(() => { // 根据roles权限生成可访问的路由表
                        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    })
                }).catch((err) => {
                    //拉取用户登录信息失败-前端退出登录
                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err || '验证失败，请再次登录！')
                        next({path: '/'})
                    })
                })
            } else {
                next()
            }
        }
    } else {
        //没有登录token时
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到登录页
            NProgress.done() // 如果当前页面是login，则不会在每个hook之后触发，所以手动处理它
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
