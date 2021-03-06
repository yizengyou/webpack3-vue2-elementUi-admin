'use strict'
const path = require('path') //路径计算模块
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf') // loader .vue文件的配置

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

module.exports = {
    //基础目录，绝对路径，用于从配置中解析入口起点(上下文)
    context: path.resolve(__dirname, '../'),
    //当存在多个入口时 ，可以使用 Array 的方式，比如依赖第三方库 babel-polyfill ，
    //最终 babel-polyfill 会被追加到打包好的输出文件中，数组中的最后一个会被 export。
    entry: {
        app: ['babel-polyfill', './src/main.js'] //构建的入口文件 等价于 entry: ['babel-polyfill', './src/main.js']
    },
    output: {
        path: config.build.assetsRoot,//构建的文件生成到哪个文件夹中
        filename: '[name].js', //生成的文件名
        //生产模式或开发模式下html、js等文件内部引用的公共路径
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    //配置模块如何解析
    resolve: {
        //自动解析确定的扩展-能够使用户在引入模块时不带扩展
        extensions: ['.js', '.vue', '.json'],
        //创建 import 或 require 的别名，来确保模块引入变得更简单
        /*
         比如如下文件
         src
           components
             a.vue
           router
             home
               index.vue
          在index.vue里面，正常引用A组件；如下：
          import A from '../../components/a.vue';
          如果设置了 alias后，那么引用的地方可以如下这样了
          import A from '@/components/a.vue';
          注意：这里的 @ 起到了 resolve('src')路径的作用了。
        */
        alias: {
            '@': resolve('src') //模块别名@指向src路径
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []), //根据配置文件确定是否需要加入代码规则检查插件
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [resolve('src/icons')],
                options: {
                    symbolId: 'icon-[name]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: [resolve('src/icons')],
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,  //字体文件
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    //这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
