// @flow

import path from 'path';

import { setMainFunction } from 'output-file-sync';
import chokidar from 'chokidar';

import { name as pkgName } from '../../package.json';

import flowFiles from '../flowFiles';

import type { flowFileType } from '../flowFiles';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { transformFileOptions } from './__ignore__/constants';

test('parse error', () => {
  expect(() => {
    reset();
    babel();
  }).toThrowError(`${pkgName} TypeError`);
});

describe('cli error', () => {
  it('can not use without @babel/cli', () => {
    expect(() => {
      reset({});
      babel();
    }).toThrowError(
      `${pkgName} only can be used with @babel/cli: Can not find \`src\` or \`outDir\``,
    );
  });
});

test('write error', () => {
  expect(() => {
    setMainFunction(() => {
      throw new Error('error');
    });
    reset(transformFileOptions);
    babel();
  }).toThrowError(`${pkgName} Error: error`);
});

test('write error with watch mode', () => {
  reset({
    ...transformFileOptions,
    watch: true,
  });
  babel();

  global.console.log = jest.fn();
  setMainFunction(() => {
    throw new Error('error');
  });
  chokidar.watchCallback(
    path.resolve(__dirname, './__ignore__/files/justDefinition.js.flow'),
  );

  expect(global.console.log).toHaveBeenCalled();
  expect(global.console.log).toHaveBeenCalledTimes(1);
  expect(global.console.log).toHaveBeenCalledWith(`${pkgName} Error: error`);
});

test('watch error when not finding babel configs', () => {
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
    `${pkgName} Error: not find ${justDefinitionPath.replace(
      `${process.cwd()}/`,
      '',
    )} babel configs`,
  );
});
