// @flow

import path from 'path';

import { setMainFunction } from 'output-file-sync';
import chokidar from 'chokidar';

import flowFiles from '../flowFiles';

import type { flowFileType } from '../flowFiles';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { transformFileOptions } from './__ignore__/constants';

test('parse error', () => {
  expect(() => {
    reset();
    babel();
  }).toThrowError('@cat-org/babel-plugin-transform-flow TypeError');
});

test('write error', () => {
  expect(() => {
    setMainFunction(() => {
      throw new Error('error');
    });
    reset(transformFileOptions);
    babel();
  }).toThrowError(`@cat-org/babel-plugin-transform-flow Error: error`);
});

test('watch error', () => {
  const justDefinitionPath = path.resolve(
    __dirname,
    './__ignore__/files/justDefinition.js.flow',
  );

  expect(() => {
    reset({
      ...transformFileOptions,
      watch: true,
    });
    babel();

    delete (
      flowFiles.store.find(
        ({ filePath }: flowFileType): boolean =>
          filePath === justDefinitionPath,
      ) || {}
    ).babelConfigs;

    chokidar.watchCallback(justDefinitionPath);
  }).toThrowError(
    `@cat-org/babel-plugin-transform-flow Error: not find ${justDefinitionPath.replace(
      `${process.cwd()}/`,
      '',
    )} babel configs`,
  );
});
