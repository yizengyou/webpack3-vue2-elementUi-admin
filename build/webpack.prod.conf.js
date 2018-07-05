'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//读取生产环境配置
const env = require('../config/prod.env')

//合并基础配置
const webpackConfig = merge(baseWebpackConfig, {
    //module的处理,主要是针对css的处理
    module: {
        rules: utils.styleLoaders({ //同样的此处调用了utils.styleLoaders
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    //(none)（省略 devtool 选项） - 不生成 source map。这是一个不错的选择。
    devtool: config.build.productionSourceMap ? config.build.devtool : false, //使用false 生产打包
    //资源输出配置
    output: {
        path: config.build.assetsRoot, //构建文件输出到哪个文件夹
        filename: utils.assetsPath('js/[name].[chunkhash].js'), //构建的文件输出位置和文件名
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') //此选项决定了非入口(non-entry) chunk 文件的名称 路由模块
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        //配置全局环境为生产环境
        new webpack.DefinePlugin({
            'process.env': env
        }),
        //js文件压缩插件
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false // 不显示警告
                }
            },
            sourceMap: config.build.productionSourceMap, //false-否   是否生成sourceMap文件
            parallel: true
        }),
        //将css提取到它自己的文件中
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'), //提取的文件名 和 路径 app.css
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            //将以下选项设置为“false”将不会从cosllit块中提取CSS。
            //它们的CSS将在webpack加载codesplit区块时，用样式加载器动态地插入。
            //增加文件大小:https://github.com/vuejb -templates/webpack/issues/1110
            allChunks: false,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? {safe: true, map: {inline: false}}
                : {safe: true}
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        //生成html的插件,引入css文件和js文件
        new HtmlWebpackPlugin({
            filename: config.build.index,  //生成的html的文件名
            template: 'index.html', //模板文件
            inject: true, //将所有资资源注入给定模板
            favicon: resolve('favicon.ico'), //将给定的图标路径添加到输出HTML
            title: '测试', //页面标题
            minify: { //压缩配置
                removeComments: true, //删除html中的注释代码
                collapseWhitespace: true, //删除html中的空白符
                removeAttributeQuotes: true //删除html元素中属性的引号
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            //需要通过CommonsChunkPlugin一致地处理多个块  //按dependency的顺序引入
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // split vendor js into its own file - 将供应商js分割成自己的文件
        // 分离公共js到vendor中
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', //文件名
            minChunks(module) { // 声明公共的模块来自node_modules文件夹
                // any required modules inside node_modules are extracted to vendor
                // 功用模块分离规则：node_modules中的任何必需模块都被提取给供应商
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        // 上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。
        // 原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。
        // 当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化。
        // 下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        // This instance extracts shared chunks from code splitted chunks and bundles them
        // in a separate chunk, similar to the vendor chunk
        // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        // 这个实例从分割的代码块中提取共享块并将它们打包
        // 在一个单独的块中，类似于供应商块
        // 参见: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        }),

        // 复制静态资源,将static文件内的内容复制到指定文件夹
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'), //复制目标
                to: config.build.assetsSubDirectory, //复制到
                ignore: ['.*']  //忽视.*文件
            }
        ])
    ]
})

// 配置文件开启了gzip压缩
if (config.build.productionGzip) {
    //引入压缩文件的组件,该插件会对生成的文件进行压缩，生成一个.gz文件
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]', //目标文件名
            algorithm: 'gzip', //使用gzip压缩
            test: new RegExp( //满足正则表达式的文件会被压缩
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240, //资源文件大于10240B=10kB时会被压缩
            minRatio: 0.8  //最小压缩比达到0.8时才会被压缩
        })
    )
}
//构建优化，显示模块分布效果图-可视化资源分析工具
if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
