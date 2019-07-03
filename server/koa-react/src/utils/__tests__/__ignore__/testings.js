// @flow

export default [
  [
    'routers',
    {
      routesData: 'routesData',
      main: 'main',
      loading: 'loading',
      error: 'error',
    },
    '/** routesData */."templates/Main"."templates/Loading"."templates/Error"',
    'routesData."main"."loading"."error"',
  ],
  [
    'set-config',
    undefined,
    '/** setConfig */',
    "require('react-hot-loader').setConfig || ",
  ],
  [
    'react-hot-loader',
    undefined,
    'module.exports = module;',
    "module.exports = require('react-hot-loader/root').hot(module);",
  ],
  [
    'react-hot-loader',
    undefined,
    'exports["default"] = module;',
    'exports["default"] = require(\'react-hot-loader/root\').hot(module);',
  ],
];
