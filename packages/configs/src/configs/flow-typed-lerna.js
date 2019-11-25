// @flow

import fs from 'fs';
import path from 'path';
import npmWhich from 'npm-which';
import { invariant } from 'fbjs';

import { requireModule } from '@mikojs/utils';

export default {
  alias: 'flow-typed',
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'flow-bin',
    'flow-typed',
  ],
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => {
    if (
      !argv.includes('install') ||
      argv.includes('-f') ||
      argv.includes('--flowVersion')
    )
      return [...argv];

    const nodeModulesPath = path.resolve('./node_modules');
    const {
      dependencies,
      devDependencies,
      peerDependencies,
      bundledDependencies,
    } = requireModule(
      path.resolve(
        npmWhich(process.cwd()).sync('lerna'),
        '../../../package.json',
      ),
    );
    const flowVersion = [
      bundledDependencies,
      peerDependencies,
      devDependencies,
      dependencies,
    ].reduce(
      (result: ?string, packages: { [string]: ?string } = {}) =>
        result || packages['flow-bin'],
      null,
    );

    invariant(flowVersion, 'Can not find `flow version` in the project');

    if (!fs.existsSync(nodeModulesPath)) fs.mkdirSync(nodeModulesPath);

    return [...argv, '-f', flowVersion.replace(/\^/, '')];
  },
  configsFiles: {
    'flow-typed': path.resolve(__dirname, './never-use-config.js'),
  },
};
