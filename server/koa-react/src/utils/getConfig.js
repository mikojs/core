// @flow

import path from 'path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import type CacheType from './Cache';

const CLIENT_PATH = path.resolve(__dirname, './client.js');
const ROOT_PATH = path.resolve(__dirname, './Root.js');

/**
 * @example
 * getConfig(true, '/folder-path', '/', data)
 *
 * @param {boolean} dev - is dev or not
 * @param {string} folderPath - folder path
 * @param {string} basename - basename to join url
 * @param {RegExp} exclude - exclude file path
 * @param {CacheType} cache - cache data
 *
 * @return {object} - webpack config
 */
export default (
  dev: boolean,
  folderPath: string,
  basename: ?string,
  exclude?: RegExp,
  cache: CacheType,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : false,
  entry: !basename
    ? {
        client: ['react-hot-loader/patch', CLIENT_PATH],
      }
    : {
        [`${basename.replace(/^\//, '')}/client`]: [
          'react-hot-loader/patch',
          CLIENT_PATH,
        ],
      },
  output: {
    path: dev ? undefined : path.resolve('./public/js'),
    publicPath: dev ? '/assets/' : '/public/js/',
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
          name: !basename
            ? 'commons'
            : `${basename.replace(/^\//, '')}/commons`,
          chunks: 'all',
          minChunks:
            cache.routesData.length > 2 ? cache.routesData.length * 0.5 : 2,
        },
      },
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      BROWSER: true,
    }),
    new ProgressBarPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [CLIENT_PATH, ROOT_PATH, folderPath],
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              path.resolve(__dirname, './babel.js'),
              {
                cacheDir: cache.cacheDir,
              },
            ],
            'react-hot-loader/babel',
          ],
        },
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, folderPath],
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
