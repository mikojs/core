// @flow

import { componentKey } from '../../replaceLoader';

export default [
  [
    'routers',
    '"templates/Main"."templates/Loading"."templates/Error"."templates/routesData"',
    '/cache-dir',
    '"/cache-dir/Main"."/cache-dir/Loading"."/cache-dir/Error"."/cache-dir/routesData"',
  ],
  [
    'client',
    '/** setConfig */ Component = _ref["default"]; /** Component */',
    undefined,
    `require('react-hot-loader').setConfig ||  Component = _ref["default"];
var ${componentKey} = _ref["${componentKey}"]; ${componentKey} || `,
  ],
  [
    'react-hot-loader',
    'module.exports = module;',
    undefined,
    `var _replace_fd5c1 = module;

exports["${componentKey}"] = _replace_fd5c1;
exports["default"] = require('react-hot-loader/root').hot(_replace_fd5c1);`,
  ],
  [
    'react-hot-loader',
    'exports["default"] = module;',
    undefined,
    `var _replace_41d81 = module;

exports["${componentKey}"] = _replace_41d81;
exports["default"] = require('react-hot-loader/root').hot(_replace_41d81);`,
  ],
];
