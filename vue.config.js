module.exports = {
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    entry: {
      app: './src/main'
    },
    output: {
      filename: 'feedback.js'
    },
    optimization: {
      splitChunks: false
    },
    module: {
      rules: [
        {
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@kazupon/vue-i18n-loader'
        }
      ]
    }
  },
  css: {
    extract: {
      filename: 'feedback.css'
    }
  },
  outputDir: `dist/${process.env.NODE_ENV}`
};