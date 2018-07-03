import Vue from 'vue' //引入vue
import Vuex from 'vuex' //引入vuex

/*
* 引入对应模块
* */
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app, //整个应用app模块
    user, //用户模块-登录-退出
    permission //路由权限模块
  },
  getters
})

export default store
