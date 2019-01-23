// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';

import { type routeDataType } from './getRoutesData';

export default (dev: boolean, routesData: $ReadOnlyArray<routeDataType>) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-source-map' : false,
  entry: {
    client: [path.resolve(__dirname, '../templates/client.js')],
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
          name: 'commons',
          chunks: 'all',
          minChunks: routesData.length > 2 ? routesData.length * 0.5 : 2,
        },
      },
    },
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, '../templates/Root.js')],
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
                  "loading: () => 'loading'",
                ].join(', ')} }) }`,
            )
            .join(', ')}] ||`,
        },
      },
    ],
  },
});
