const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'vue Element Admin'

const port = process.env.port || process.env.npm_config_port || 5000

module.exports = {
  transpileDependencies: true,
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    port: port,
    open: false,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true, // 配置跨域
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
    // setupMiddlewares: (middlewares, devServer) => {
    //   if (!devServer) {
    //     throw new Error('webpack-dev-server is not defined')
    //   }
    //   // require('./mock/mock-server.js')
    //   middlewares.unshift({
    //     name: 'user-login',
    //     // `path` 是可选的，接口路径
    //     path: '/vue-element-admin/user/login',
    //     middleware: (req, res) => {
    //       // mock 数据模拟接口数据
    //       // res.send({ name: 'moon mock' })
    //       res.json(req.body)
    //     }
    //   })

    //   return middlewares
    // }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack: (config) => {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()
  }
}
