// @flow

import { transformSync } from '@babel/core';

import babelPluginImportCss from '../index';

test('babel-plugin-import-css', () => {
  expect(
    transformSync(
      `import styles from './styles.css';
import test from 'test';

const a = 'test';`,
      {
        presets: ['@babel/env'],
        plugins: [babelPluginImportCss],
        babelrc: false,
        configFile: false,
      },
    ).code,
  ).toMatch(/globalThis\.window \? require\("\.\/styles\.css"\) : {}/);
});
