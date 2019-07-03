// @flow

export default [
  [
    'routers',
    '/** routesData */."templates/Main"."templates/Loading"."templates/Error"',
    {
      routesData: 'routesData',
      main: 'main',
      loading: 'loading',
      error: 'error',
    },
    'routesData."main"."loading"."error"',
  ],
  [
    'set-config',
    '/** setConfig */',
    undefined,
    "require('react-hot-loader').setConfig || ",
  ],
  [
    'react-hot-loader',
    'module.exports = module;',
    undefined,
    `var _replace_fd5c1 = module;

module.exports = require('react-hot-loader/root').hot(_replace_fd5c1);`,
  ],
  [
    'react-hot-loader',
    'exports["default"] = module;',
    undefined,
    `var _replace_41d81 = module;

exports["default"] = require('react-hot-loader/root').hot(_replace_41d81);`,
  ],
  [
    'react-hot-loader',
    `module.exports = module;

module.test = () => {};`,
    undefined,
    `var _replace_1ffc4 = module;

module.test = () => {};

module.exports = require('react-hot-loader/root').hot(_replace_1ffc4);`,
  ],
  [
    'react-hot-loader',
    `exports["default"] = module;

module.test = () => {};`,
    undefined,
    `var _replace_cecb6 = module;

module.test = () => {};

exports["default"] = require('react-hot-loader/root').hot(_replace_cecb6);`,
  ],
];
