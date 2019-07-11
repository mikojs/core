// @flow

import path from 'path';

const routesData = `module.exports = [{ exact: true, path: ["/"], component: { chunkName: 'pages/index', loader: () => import(/* webpackChunkName: "pages/index" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/__tests__/__ignore__/page/index.js') } }, { exact: true, path: ["/otherPath"], component: { chunkName: 'pages/otherPath', loader: () => import(/* webpackChunkName: "pages/otherPath" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/__tests__/__ignore__/page/otherPath.js') } }, { exact: true, path: ["/otherFolder/otherFolder"], component: { chunkName: 'pages/otherFolder/otherFolder/index', loader: () => import(/* webpackChunkName: "pages/otherFolder/otherFolder/index" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/__tests__/__ignore__/page/otherFolder/otherFolder/index.js') } }, { exact: true, path: ["/noGetInitialProps"], component: { chunkName: 'pages/noGetInitialProps', loader: () => import(/* webpackChunkName: "pages/noGetInitialProps" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/__tests__/__ignore__/page/noGetInitialProps.js') } }, { exact: true, path: ["/multipleLazy"], component: { chunkName: 'pages/multipleLazy', loader: () => import(/* webpackChunkName: "pages/multipleLazy" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/__tests__/__ignore__/page/multipleLazy.js') } }, { exact: true, path: ["/error"], component: { chunkName: 'pages/error', loader: () => import(/* webpackChunkName: "pages/error" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/__tests__/__ignore__/page/error.js') } }, { exact: true, path: ["/*"], component: { chunkName: 'pages/notFound', loader: () => import(/* webpackChunkName: "pages/notFound" */ '/Users/hsuting/Desktop/work/core/server/koa-react/src/templates/NotFound.js') } }]`;

const mainFilePath = path.resolve(__dirname, './page/.templates/Main.js');
const loadingFilePath = path.resolve(__dirname, './page/.templates/Loading.js');
const errorFilePath = path.resolve(__dirname, './page/.templates/Error.js');

export default [
  [
    path.resolve(__dirname, './page/index.js'),
    [path.resolve('./node_modules/.cache/no-basename/routesData.js')],
    [routesData],
  ],
  [path.resolve(__dirname, './page/.templates/Document.js'), [], []],
  [
    mainFilePath,
    [path.resolve('./node_modules/.cache/no-basename/Main.js')],
    [
      `module.exports = require('${mainFilePath}').default || require('${mainFilePath}');`,
    ],
  ],
  [
    loadingFilePath,
    [path.resolve('./node_modules/.cache/no-basename/Loading.js')],
    [
      `module.exports = require('${loadingFilePath}').default || require('${loadingFilePath}');`,
    ],
  ],
  [
    errorFilePath,
    [path.resolve('./node_modules/.cache/no-basename/Error.js')],
    [
      `module.exports = require('${errorFilePath}').default || require('${errorFilePath}');`,
    ],
  ],
  [
    path.resolve(__dirname, './page/.templates/NotFound.js'),
    [path.resolve('./node_modules/.cache/no-basename/routesData.js')],
    [
      routesData.replace(
        /templates\/NotFound.js/,
        '__tests__/__ignore__/page/.templates/NotFound.js',
      ),
    ],
  ],
  [path.resolve(__dirname, './page/.templates/Others.js'), [], []],
  [path.resolve(__dirname, './page/exclude.js'), [], []],
  [__dirname, [], []],
];
