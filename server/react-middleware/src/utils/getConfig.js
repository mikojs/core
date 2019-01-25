// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';

import { type routeDataType } from './getRoutesData';

const CLIENT_PATH = path.resolve(__dirname, './client.js');
const ROOT_PATH = path.resolve(__dirname, './Root.js');

export default (
  dev: boolean,
  folderPath: string,
  basename: ?string,
  routesData: $ReadOnlyArray<routeDataType>,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : false,
  entry: !basename
    ? {
        client: [CLIENT_PATH],
      }
    : {
        [`${basename.replace(/^\//, '')}/client`]: [CLIENT_PATH],
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
        commons: {
          name: !basename
            ? 'commons'
            : `${basename.replace(/^\//, '')}/commons`,
          chunks: 'all',
          minChunks: routesData.length > 2 ? routesData.length * 0.5 : 2,
        },
      },
    },
  },
  module: {
    rules: [
      {
        include: [CLIENT_PATH],
        loader: 'string-replace-loader',
        options: {
          search: '/** replace routesData */',
          replace: `[${routesData
            .map(
              ({ routePath, chunkName, filePath }: routeDataType): string =>
                `{ routePath: ${JSON.stringify(
                  routePath,
                )}, chunkName: '${chunkName}', component: require('react-loadable')({ ${[
                  `loader: () => import(/* webpackChunkName: "${chunkName}" */ '${filePath}')`,
                  `webpack: () => [ require.resolveWeak('${filePath}') ]`,
                  `modules: [ '${filePath}' ]`,
                  // TODO: add default loading
                  "loading: ({ error }) => error ? error.message : 'loading'",
                ].join(', ')} }) }`,
            )
            .join(', ')}] ||`,
        },
      },
      {
        include: [folderPath, ROOT_PATH],
        loader: 'string-replace-loader',
        options: {
          search: 'module.exports = ((.|\n)*);',
          replace: `module.exports = require('react-hot-loader/root').hot($1)`,
          flags: 'g',
        },
      },
      {
        test: /\.jsx?$/,
        include: /node_modules/,
        use: ['react-hot-loader/webpack'],
      },
    ],
  },
});
