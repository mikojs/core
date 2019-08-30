// @flow

export default [
  [
    'routers',
    '"templates/Main"."templates/Loading"."templates/Error"."templates/routesData"',
    '/cache-dir',
    '"/cache-dir/Main"."/cache-dir/Loading"."/cache-dir/Error"."/cache-dir/routesData"',
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
    `exports["default"] = module;

exports.test = () => {};`,
    undefined,
    `var _replace_293fa = module;

exports.test = () => {};

exports["default"] = require('react-hot-loader/root').hot(_replace_293fa);`,
  ],
];
