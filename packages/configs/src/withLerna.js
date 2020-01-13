// @flow

import gitBranch from 'git-branch';

import { type configsType, type objConfigType } from './types';
import configs from './configs';

export default Object.keys(configs).reduce(
  (result: configsType, key: $Keys<typeof configs>): configsType => {
    const newConfig: objConfigType = {
      install: (install: $ReadOnlyArray<string>) => [...install, '-W'],
    };

    switch (key) {
      case 'babel':
      case 'server':
        newConfig.run = (argv: $ReadOnlyArray<string>) => [
          ...argv,
          '--config-file',
          '../../babel.config.js',
        ];
        break;

      case 'exec':
        newConfig.install = (install: $ReadOnlyArray<string>) => [
          ...install,
          'git-branch',
        ];

        newConfig.run = (argv: $ReadOnlyArray<string>) =>
          argv.reduce(
            (newArgv: $ReadOnlyArray<string>, argvStr: string) => [
              ...newArgv,
              ...(argvStr === '--changed'
                ? ['--since', gitBranch.sync().replace(/Branch: /, '')]
                : [argvStr]),
            ],
            [],
          );

        newConfig.config = (config: {}) => ({
          ...config,
          lerna: {
            flow: [
              'lerna',
              'exec',
              `"flow --quiet${process.env.CI ? ' && flow stop' : ''}"`,
              '--stream',
              '--concurrency',
              '1',
            ],
          },
        });
        break;

      default:
        break;
    }

    return {
      ...result,
      [key]: newConfig,
    };
  },
  {},
);
