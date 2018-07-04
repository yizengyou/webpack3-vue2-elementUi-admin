import 'babel-polyfill' // es6垫片

import Vue from 'vue' //引入vue
import 'normalize.css/normalize.css'// CSS重置的现代替代品

import ElementUI from 'element-ui'  //引入element-ui
import 'element-ui/lib/theme-chalk/index.css'

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n 引入国际化语言切换

import '@/styles/index.scss' // 全局样式

import App from './App' //挂载app模板
import router from './router' //引入路由配置
import store from './store' //引入状态管理

import '@/icons' // svg图标组件签化
import '@/permission' // 引入路由跳转的权限判断

import * as filters from './filters' // global filters

Vue.use(ElementUI) //使用element-ui

//在实例上注册全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false //设置为 false 以阻止 vue 在启动时生成生产提示

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
