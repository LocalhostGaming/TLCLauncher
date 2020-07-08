const htmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        productName: process.env.VUE_APP_NAME,
        win: {
          icon: './src/assets/extra/icon.ico',
        },
        extraResources: [
          {
            from: './src/assets/extra/',
            to: 'extra',
            filter: [
              '**/*',
            ],
          },
        ],
        protocols: {
          name: 'lostlauncher',
          schemes: [
            'lostlauncher',
            'app',
          ],
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/_variables.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    const fontsRule = config.module.rule('fonts');
    const imageRule = config.module.rule('images');
    fontsRule.uses.clear();
    imageRule.uses.clear();

    config.module
      .rule('fonts')
      .test(/\.(ttf|otf|woff(2)?)$/)
      .use('base64-inline-loader')
      .loader('base64-inline-loader')
      .end();

    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif)$/i)
      .use('base64-inline-loader')
      .loader('base64-inline-loader')
      .end();

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
