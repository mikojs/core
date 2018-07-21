// @flow

import fs from 'fs';
import path from 'path';

import { transformFileSync } from '@babel/core';
import rimraf from 'rimraf';

import babelPluginTransformFlow from '..';

const srcPath = path.resolve(__dirname, './__ignore__/src');
const libPath = path.resolve(__dirname, './__ignore__/lib');

/**
 * @example
 * babelConfigs()
 *
 * @param {boolean} generateFlowTest - add options to generateFlowTest
 * @return {Object} the object of the babel configs
 */
const babelConfigs = (generateFlowTest: boolean | string = false): {} => ({
  cwd: path.resolve(__dirname, './__ignore__'),
  babelrc: false,
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: [
    [
      babelPluginTransformFlow,
      {
        generateFlowTest,
      },
    ],
  ],
});

/**
 * @example
 * content();
 *
 * @param {string} moduleName - module name
 * @return {string} content string
 */
const content = (moduleName: string = 'test'): string => `/**
 * Build files by @cat-org/babel-plugin-transform-flow
 */

declare module "${moduleName === 'test' ? 'test' : `test/lib/${moduleName}`}" {
  declare type ${moduleName}Type = '${moduleName}';

  declare module.exports: ${moduleName}Type;
}`;

describe('test', () => {
  beforeAll((): void => rimraf.sync(libPath));

  it('no generate flow files with no import flow type', () => {
    transformFileSync(
      path.resolve(srcPath, './noFlowType.js'),
      babelConfigs('./lib/checkFlow.js.flow'),
    );

    expect(
      fs.existsSync(path.resolve(libPath, './checkFlow.js.flow')),
    ).toBeFalsy();
  });

  it('generate flow files', () => {
    ['index', 'foo'].map((fileName: string) => {
      transformFileSync(
        path.resolve(srcPath, `./${fileName}.js`),
        babelConfigs(),
      );

      expect(
        fs.readFileSync(
          path.resolve(libPath, `./flow-typed/${fileName}.js.flow`),
          'utf-8',
        ),
      ).toBe(content(fileName === 'index' ? 'test' : fileName));
    });
  });

  it('generate flow test', () => {
    transformFileSync(
      path.resolve(srcPath, './index.js'),
      babelConfigs('./lib/checkFlow.js.flow'),
    );

    expect(
      fs.readFileSync(path.resolve(libPath, './checkFlow.js.flow'), 'utf-8'),
    ).toBe(`// @flow

import type testType from 'test';
import type fooType from 'test/lib/foo';

import test from '../src';
import foo from '../src/foo';

(test: testType);
(foo: fooType);`);
  });

  afterAll((): void => rimraf.sync(libPath));
});
