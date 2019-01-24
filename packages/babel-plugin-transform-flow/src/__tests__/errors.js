// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';
import chokidar from 'chokidar';

import { name as pkgName } from '../../package.json';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { transformFileOptions } from './__ignore__/constants';

import flowFiles, { type flowFileType } from 'utils/flowFiles';

test('parse error', () => {
  expect(() => {
    reset();
    babel();
  }).toThrow(`${pkgName} TypeError`);
});

describe('cli error', () => {
  test('can not use without @babel/cli', () => {
    expect(() => {
      reset({});
      babel();
    }).toThrow(
      `${pkgName} only can be used with @babel/cli: Can not find \`src\` or \`outDir\``,
    );
  });
});

test('write error', () => {
  expect(() => {
    outputFileSync.mainFunction = () => {
      throw new Error('error');
    };
    reset(transformFileOptions);
    babel();
  }).toThrow(`${pkgName} Error: error`);
});

test('write error with watch mode', () => {
  const mockLog = jest.fn();

  reset({
    ...transformFileOptions,
    watch: true,
  });
  babel();

  global.console.log = mockLog;
  outputFileSync.mainFunction = () => {
    throw new Error('error');
  };
  chokidar.watchCallback(
    path.resolve(__dirname, './__ignore__/files/justDefinition.js.flow'),
  );

  expect(mockLog).toHaveBeenCalled();
  expect(mockLog).toHaveBeenCalledTimes(1);
  expect(mockLog).toHaveBeenCalledWith(`${pkgName} Error: error`);
});

test('watch error when not finding babel config', () => {
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
        ({ filePath }: flowFileType) => filePath === justDefinitionPath,
      ) || {}
    ).babelConfig;

    chokidar.watchCallback(justDefinitionPath);
  }).toThrow(
    `${pkgName} Error: not find ${justDefinitionPath.replace(
      `${process.cwd()}/`,
      '',
    )} babel config`,
  );
});
