'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    //文件路径开头是mock，就会代理到mock数据
    BASE_API: '"/mock/"', //接口请求基础路径
    BASE_MOCK_API: "/mock/" //mock代理拦截匹配字串 只要改值和上面的BASE_API一致，就会代理到mock数据
})
