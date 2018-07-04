'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config') //读取配置
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf') // 输出webpack基础配置
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder') //查看端口进程
const fs = require('fs')

/***************************************
 * 添加mock数据
 * ***************************************/
const devConfig = require('../config/dev.env');
const glob = require('glob');
//node.js开发框架express，用来简化操作
const express = require('express');
//创建node.js的express开发框架的实例
const app = express();
//实例化一个路由
const apiRoutes = express.Router();

// 同步读取mock下的所有json文件，
// 数组reduce方法之后生成有效加载地址映射表 (数据结构：{'login':'../mock/data/login.json' })
let entryJS = glob.sync('./mock/**/*.json').reduce(function (prev, curr) {
    prev[curr.slice(7, -5)] = curr; //多家一个点，生成有效的require文件加载地址
    return prev;
}, {})

//配置
app.use(devConfig.BASE_MOCK_API, apiRoutes);

/**************************************
 * end
 * ***************************************/

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//读取config/index.js中的环境配置(其实全是undefined，根本没有配置这个)
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//合并配置文件
const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        // 通过传入一些配置来获取rules配置，此处传入了sourceMap: false,表示不生成sourceMap
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning', //日志输出
        historyApiFallback: true, //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        hot: true, //开启热替换
        compress: true, //一切服务都启用gzip 压缩
        host: HOST || config.dev.host, //本地服务域名设置
        port: PORT || config.dev.port, //本地服务端口号设置
        open: config.dev.autoOpenBrowser, //启动后自动打开流浪器
        overlay: config.dev.errorOverlay  //当出现编译错误或警告时，在浏览器中显示全屏覆盖。默认情况下禁用。如果您只想显示编译器错误:
            ? {warnings: false, errors: true}
            : false,
        publicPath: config.dev.assetsPublicPath, //此路径下的打包文件可在浏览器中访问
        proxy: config.dev.proxyTable, //设置代理
        quiet: true, // necessary for FriendlyErrorsPlugin 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台
        watchOptions: {  //与监视文件相关的控制选项。
            poll: config.dev.poll,
        },

        //代理mock数据
        before(app) {

            for (let key in entryJS) {
                (function (key) {

                    app.get(devConfig.BASE_MOCK_API + key, function (req, res) {
                        res.json(JSON.parse(fs.readFileSync(entryJS[key], 'utf8')));
                    });

                    app.post(devConfig.BASE_MOCK_API + key, function (req, res) {
                        res.json(JSON.parse(fs.readFileSync(entryJS[key], 'utf8')));
                    });

                })(key);
            }
        }
    },
    plugins: [
        // 编译时配置的全局变量
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env') //当前环境为开发环境
        }),
        //热更新插件
        new webpack.HotModuleReplacementPlugin(),
        // HMR在更新时在控制台显示正确的文件名。
        new webpack.NamedModulesPlugin(),
        //在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。对于所有资源，统计资料(stat)的 emitted 标识都是 false。
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        //自动生成html文件,比如编译后文件的引入
        new HtmlWebpackPlugin({
            filename: 'index.html', //生成的文件名
            template: 'index.html', //模板
            inject: true, //将所有资产注入给定模板
            favicon: resolve('favicon.ico'),//将给定的图标路径添加到输出HTML
            title: '我的后台管理系统模板' //标题
        }),
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    //检查端口进程-是否占用
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({ //输出友好提示
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})
