// @flow

import path from 'path';

import { transformSync } from '@babel/core';

import babelPluginImportCss from '../index';

test('babel-plugin-import-css', () => {
  expect(
    transformSync(
      `import styles from './styles.css';
import test from 'test';

const a = 'test';`,
      {
        filename: path.resolve(__dirname, './src/filename.js'),
        presets: ['@babel/env'],
        plugins: [
          [
            'css-modules-transform',
            {
              keepImport: true,
            },
          ],
          babelPluginImportCss,
        ],
        babelrc: false,
        configFile: false,
      },
    ).code,
  ).toMatch(
    /globalThis\.window \? "\.\/styles.css" : "\.\.\/\.\.\/emptyCssFile\.js"/,
  );
});
