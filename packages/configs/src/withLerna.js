// @flow

import execa from 'execa';

import { type configsType, type objConfigType } from './types';
import configs from './configs';

type babelArgvResultType = {|
  isWatching: boolean,
  filteredArgv: $ReadOnlyArray<string>,
|};

const newConfigs = {
  exec: {
    install: (argv: $ReadOnlyArray<string>) => [...argv, 'lerna'],
    config: () => ({
      'lerna:babel': async (
        argv: $ReadOnlyArray<string>,
      ): Promise<$ReadOnlyArray<string>> => {
        const { isWatching, filteredArgv } = argv.reduce(
          (result: babelArgvResultType, key: string): babelArgvResultType => {
            const isWatchOptionExist = ['--watch', '-w'].includes(key);

            return {
              isWatching: result.isWatching || isWatchOptionExist,
              filteredArgv: isWatchOptionExist
                ? result.filteredArgv
                : [...result.filteredArgv, key],
            };
          },
          {
            isWatching: false,
            filteredArgv: [],
          },
        );

        return [
          'lerna',
          'exec',
          `"configs babel${isWatching ? ' -w' : ''}"`,
          '--parallel',
          '--stream',
          ...(!isWatching
            ? []
            : [
                '--since',
                (await execa('git', ['branch'])).stdout
                  .replace(/^[^*] (.*)$/m, '')
                  .replace(/[*\n ]/g, ''),
              ]),
          ...filteredArgv,
        ];
      },
    }),
  },
};

export default Object.keys(configs).reduce(
  (result: configsType, key: $Keys<typeof configs>): configsType => {
    if (Object.keys(newConfigs).includes(key)) return result;

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

      default:
        break;
    }

    return {
      ...result,
      [key]: newConfig,
    };
  },
  newConfigs,
);
