'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    proxy: {
      '/app': {//请求前缀，有这个前缀(紧跟端口号)的才会走代理
        target: 'http://172.18.148.1',//后端的接口
        pathRewrite: { "^/app": "" },//pathRewrite的key写一个正则的匹配条件,匹配以test开头的路径，把test替换为空字符串
        changeOrigin: true,//是否对告诉真实服务器真实的源，false不改变源(真实的源) true(改变源)-----用于控制请求头中的host值
        logLevel: 'debug'
      },
      '/plv': {//请求前缀，有这个前缀(紧跟端口号)的才会走代理
        target: 'http://api.polyv.net',//后端的接口
        pathRewrite: { "^/plv": "" },//pathRewrite的key写一个正则的匹配条件,匹配以test开头的路径，把test替换为空字符串
        changeOrigin: true,//是否对告诉真实服务器真实的源，false不改变源(真实的源) true(改变源)-----用于控制请求头中的host值
        logLevel: 'debug'
      },
      '/api': {//请求前缀，有这个前缀(紧跟端口号)的才会走代理
        target: 'http://hunan-tech.igeeker.org',//后端的接口
        // pathRewrite: { "^/api": "" },//pathRewrite的key写一个正则的匹配条件,匹配以test开头的路径，把test替换为空字符串
        changeOrigin: true,//是否对告诉真实服务器真实的源，false不改变源(真实的源) true(改变源)-----用于控制请求头中的host值
        logLevel: 'debug'
      },
      '/acc': {//请求前缀，有这个前缀(紧跟端口号)的才会走代理
        target: 'http://hls.videocc.net',//后端的接口
        pathRewrite: { "^/acc": "" },//pathRewrite的key写一个正则的匹配条件,匹配以test开头的路径，把test替换为空字符串
        changeOrigin: true,//是否对告诉真实服务器真实的源，false不改变源(真实的源) true(改变源)-----用于控制请求头中的host值
        logLevel: 'debug'
      },
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
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
