const htmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        productName: process.env.VUE_APP_NAME,
        win: {
          icon: './src/assets/extra/icon.ico',
        },
        protocols: {
          name: 'lostlauncher',
          schemes: [
            'lostlauncher',
          ],
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/variables.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader');

    config.plugin('preload').tap((args) => {
      args[0].fileBlacklist.push(/\.css/, /\.js/);
      return args;
    });

    config
      .plugin('inline-source')
      .use(htmlWebpackInlineSourcePlugin);

    config.plugin('html').tap((value) => {
      const args = value;
      args[0].inlineSource = '.(js|css)$';
      return args;
    });
  },
};
