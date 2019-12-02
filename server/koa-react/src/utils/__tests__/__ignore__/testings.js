// @flow

import path from 'path';

export default [
  [
    `import React from 'react';

import Main from '../../../templates/Main';
import Loading from '../../../templates/Loading';
import Error from '../../../templates/Error';
import routesData from '../../../templates/routesData';`,
    `"use strict";

var _react = _interopRequireDefault(require("react"));

var _Main = _interopRequireDefault(require("Main"));

var _Loading = _interopRequireDefault(require("Loading"));

var _Error = _interopRequireDefault(require("Error"));

var _routesData = _interopRequireDefault(require("routesData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }`,
  ],
  [
    `import React from 'react';

export default Root;`,
    `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = require("react-hot-loader/root").hot(require("@mikojs/koa-react/lib/utils/getStatic").hoistNonReactStaticsHotExported(Root, process.env.NODE_ENV !== "production"));

exports["default"] = _default;`,
  ],
  [
    `import React from 'react';

module.exports = Root;`,
    `"use strict";

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = require("react-hot-loader/root").hot(require("@mikojs/koa-react/lib/utils/getStatic").hoistNonReactStaticsHotExported(Root, process.env.NODE_ENV !== "production"));`,
  ],
  [
    `import Main from '../../../templates/Main';

delete require.cache['test'];`,
    `"use strict";

var _Main = _interopRequireDefault(require("../../../templates/Main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

delete require.cache['test'];`,
  ],
  [
    `import React from 'react';

module.exports;`,
    `"use strict";

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports;`,
  ],
  [
    `import React from 'react';
import Main from '../../../templates/Main';`,
    `"use strict";

var _react = _interopRequireDefault(require("react"));

var _Main = _interopRequireDefault(require("../../../templates/Main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }`,
    (filename: string) =>
      path.resolve(__dirname, '../../../templates', filename),
  ],
];
