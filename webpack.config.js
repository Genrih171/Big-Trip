const path = require('path');
const CopyPlagin = require('copy-webpack-plugin');

module.exports = {
  input: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  devtool: 'source-map',
  plugins: [
    new CopyPlagin({
      patterns: [{from: 'public'}]
    })
  ],
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ['babel-loader']
        }
    ]
  }
}
