const path = require('path');
const glob = require('glob'); //全局检查 
//const entry = require('./webpack_config/entry_webpack.js'); //入口
const purifyCSS = require('purifycss-webpack'); //检查无用css删除
const uglify = require('uglifyjs-webpack-plugin'); // 代码压缩
const htmlplugin = require('html-webpack-plugin'); //
const webpack = require('webpack');
const extracttextkplugin = require('extract-text-webpack-plugin'); //生成文件
// if (process.env.type == "dev") { //接收打包类型 dev 为开发环境
//     var website = {
//         publicpath: "http://127.0.0.1:7777/" // 一定要加http
//     }
// } else {
//     var website = {
//         publicpath: "http://192.168.51.26/:7777/" // 一定要加http
//     }
// }

var website = {
        publicpath: "http://127.0.0.1:8080/" // 一定要加http
    }
    //  var website = { 
    //     publicpath:"http:/192.168.51.26/:7777/"// 一定要加http
    // }
module.exports = {
    //devtool: 'source-map', // 开发工具
    entry: {
        entry: './src/js/entry.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js', // 输出的名字
        publicPath: website.publicpath //公共路径
    },
    module: {
        rules: [{ // 配置规则
                test: /\.css$/, // 用正则找到需要配置的扩展名
                use: extracttextkplugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            //loader :['style-loader','css-loader']  第二种写法 
            {
                test: /\.(png|gif|jpg)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50, // 限制文件大小小于该值就会使用base64
                        outputPath: "images/"
                    }
                }]

            }, {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']

            },
            {
                test: /\.less$/,
                use: extracttextkplugin.extract({
                    use: [{
                            loader: "css-loader"
                        },
                        {
                            loader: "less-loader"
                        }
                    ],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                use: extracttextkplugin.extract({
                    use: [{
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader"
                        }
                    ],
                    fallback: "style-loader"
                })
            },
        ],
    },
    plugins: [
        //插件
        new webpack.optimize.CommonsChunkPlugin({
            name: ['done'],
            filename: "assets/js/[name].js",
            minChunks: 2
        }),
        new webpack.BannerPlugin('此文件由xc于2018-7-23日学习编写。'),
        new webpack.ProvidePlugin({
            // 引用类库按需打包
            $: "jquery",
            Vue: "vue",
            done: 'done'
        }),
        new uglify(), //在这启用 
        new htmlplugin({
            minify: {
                removeAttributeQuotes: true, //清除引号 
            },
            hash: true, //清除缓存
            template: './src/index.html'
        }),
        new extracttextkplugin("css/style.css"), //此处参数为css的路径
        new purifyCSS({
            paths: glob.sync(path.join(__dirname, 'src/*.html')) //找到src 下面的全部html
        }),

        new webpack.HotModuleReplacementPlugin() //
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '127.0.0.1',
        compress: true,
        port: 7777,
    },
    watchOptions: {
        //自动打包
        poll: 1000, // 监测频率
        aggregateTimeout: 300, //防止重复打包
        ignored: /node_modules/ // 不需要打包的路径

    }

}