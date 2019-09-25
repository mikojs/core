// @flow

import fs from 'fs';
import path from 'path';
import npmWhich from 'npm-which';

import { requireModule } from '@mikojs/utils';

export default {
  alias: 'flow-typed',
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'flow-bin',
    'flow-typed',
  ],
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => {
    const { devDependencies: { 'flow-bin': flowVersion } = {} } = requireModule(
      path.resolve(
        npmWhich(process.cwd()).sync('lerna'),
        '../../../package.json',
      ),
    );
    const nodeModulesPath = path.resolve('./node_modules');

    if (!flowVersion)
      throw new Error('Can not find `flow version` in the project');
    if (!fs.existsSync(nodeModulesPath)) fs.mkdirSync(nodeModulesPath);

    return [...argv, 'install', '-f', flowVersion.replace(/\^/, '')];
  },
  configFiles: {
    emptyConfig: path.resolve(__dirname, './emptyConfig.js'),
  },
};
