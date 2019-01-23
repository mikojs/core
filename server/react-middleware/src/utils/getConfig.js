// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';

export default (
  dev: boolean,
  entry: { string: [string] },
  totalPages: number,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-source-map' : false,
  entry,
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
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: totalPages > 2 ? totalPages * 0.5 : 2,
        },
      },
    },
  },
});
