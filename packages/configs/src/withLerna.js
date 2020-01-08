// @flow

import execa from 'execa';

import { type configsType, type objConfigType } from './types';
import configs from './configs';

const CHANGED_OPTIONS = ['-c', '--changed'];
const WATCH_OPTIONS = ['-w', '--watch'];

/**
 * @example
 * addChangedOptions(['lerna', 'exec', ...])
 *
 * @param {Array} argv - original argv
 *
 * @return {Promise} - new argv
 */
const addChangedOptions = async (argv: $ReadOnlyArray<string>) => [
  ...argv.filter((key: string) => !CHANGED_OPTIONS.includes(key)),
  ...(!argv.some((key: string) => CHANGED_OPTIONS.includes(key))
    ? []
    : [
        '--since',
        (await execa('git', ['branch'])).stdout
          .replace(/^[^*] (.*)$/m, '')
          .replace(/[*\n ]/g, ''),
      ]),
];

const newConfigs = {
  exec: {
    install: (argv: $ReadOnlyArray<string>) => [...argv, 'lerna'],
    config: () => ({
      // babel
      'lerna:babel': (argv: $ReadOnlyArray<string>) =>
        addChangedOptions([
          'lerna',
          'exec',
          `"configs babel${
            argv.some((key: string) => WATCH_OPTIONS.includes(key)) ? ' -w' : ''
          }"`,
          '--parallel',
          '--stream',
          ...argv.filter((key: string) => !WATCH_OPTIONS.includes(key)),
        ]),

      // flow
      'lerna:flow': (argv: $ReadOnlyArray<string>) =>
        addChangedOptions([
          'lerna',
          'exec',
          `"flow --quiet${process.env.CI ? ' && flow stop' : ''}"`,
          '--stream',
          '--concurrency',
          '1',
          ...argv,
        ]),
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
