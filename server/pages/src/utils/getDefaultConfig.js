// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

/**
 * @param {boolean} dev - dev mode or not
 * @param {string} clientName - client name
 * @param {string} clientPath - client path
 * @param {string} chunkHash - chunk hash of the file
 * @param {string} commonsName - commons name
 * @param {number} minChunks - min chunks
 * @param {RegExp} extensions - file extensions
 * @param {string} folderPath - folder path
 *
 * @return {object} - webpack default config
 */
export default (
  dev: boolean,
  clientName: string,
  clientPath: string,
  chunkHash: string,
  commonsName: string,
  minChunks: number,
  extensions: RegExp,
  folderPath: string,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : false,
  entry: {
    [clientName]: ['react-hot-loader/patch', clientPath],
  },
  output: {
    path: dev ? undefined : path.resolve('./public/js'),
    publicPath: dev ? '/assets/' : '/public/js/',
    filename: dev ? '[name].js' : `[name].${chunkHash}.min.js`,
    chunkFilename: dev ? '[name].js' : `[name].${chunkHash}.min.js`,
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
          name: commonsName,
          chunks: 'all',
          minChunks,
        },
      },
    },
  },
  plugins: [new ProgressBarPlugin()],
  module: {
    rules: [
      {
        test: extensions,
        include: [clientPath, folderPath],
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
});
