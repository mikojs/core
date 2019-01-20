// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

export default (dev: boolean) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-source-map' : false,
  entry: {
    client: [path.resolve(__dirname, './client.js')],
  },
  output: {
    path: dev ? undefined : path.resolve('./public/js'),
    publicPath: '/assets/',
    filename: dev ? '[name].js' : '[name].[chunkhash:8].min.js',
    chunkFilename: dev ? '[name].js' : '[name].[chunkhash:8].min.js',
  },
  optimization: {
    minimize: !dev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
      },
    },
  },
  plugins: dev
    ? [
        new FriendlyErrorsWebpackPlugin({
          clearConsole: false,
        }),
      ]
    : [],
});
