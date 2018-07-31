// @flow

import { transformSync } from '@babel/core';

import babelPluginTransformFlow from '../..';
import reset from './reset';

const defaultCode = `// @flow

export default 'no code';`;

export default (code?: string = defaultCode, options?: {} = {}) => {
  reset(options);
  transformSync(code, {
    cwd: __dirname,
    babelrc: false,
    plugins: [babelPluginTransformFlow],
  });
};
