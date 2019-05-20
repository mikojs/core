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
        filename: './src/filename',
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
    new RegExp(
      `globalThis.window \\? "./styles.css" : "${path.resolve(
        __dirname,
        '../emptyCssFile.js',
      )}"`,
    ),
  );
});
