// @flow

import gitBranch from 'git-branch';

import { type mikoConfigsType } from '@mikojs/miko';

import flowTypedCache from './utils/flowTypedCache';
import findCustomFlowConfigs from './utils/findCustomFlowConfigs';
import extendCommand from './utils/extendCommand';

export default {
  /**
   * @param {object} config - prev miko config
   *
   * @return {object} - new miko config
   */
  miko: (config: mikoConfigsType): mikoConfigsType => ({
    ...config,
    flow: {
      /**
       * @return {string} - command string
       */
      command: (): string => {
        const isCI = process.env.CI === 'true';
        const flow = [
          isCI ? 'flow stop' : '',
          'flow --quiet',
          isCI ? 'flow stop' : '',
        ]
          .filter(Boolean)
          .join(' && ');

        return `${flow} && lerna exec '${flow}' --stream --concurrency 1`;
      },
      description: 'Run `flow` with the lerna command.',
    },
    'flow-typed:save-cache': {
      command: flowTypedCache.save,
      description: 'Save `flow-typed` in the cache folder.',
    },
    'flow-typed:restore-cache': {
      command: flowTypedCache.restore,
      description: 'Restore `flow-typed` from the cache folder.',
    },
    'flow-typed:install': {
      ...config['flow-typed:install'],
      command: [
        config['flow-typed:install']?.command,
        'flow-mono create-symlinks .flowconfig',
        'flow-mono install-types --ignoreDeps=peer',
      ]
        .filter(Boolean)
        .join(' && '),
    },
    build: {
      ...config.build,
      command: 'lerna exec "miko babel" --parallel --stream',
    },
    dev: {
      ...config.dev,

      /**
       * @return {string} - command string
       */
      command: (): string => {
        const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'main';

        return `lerna exec "miko babel -w" --parallel --stream --since ${branch}`;
      },
    },
    prod: {
      ...config.prod,
      command:
        'NODE_ENV=production && lerna exec "miko babel" --parallel --stream',
    },
    'husky:pre-commit': {
      ...config['husky:pre-commit'],

      /**
       * @return {string} - command string
       */
      command: (): string => {
        const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'main';

        return `miko build --since ${branch} && miko flow --since ${branch} && lint-staged`;
      },
    },
    'husky:post-merge': {
      ...config['husky:post-merge'],
      command: 'miko build',
    },
    'husky:post-checkout': {
      ...config['husky:post-checkout'],
      command: 'miko build --since main',
    },
    release: {
      ...config.release,
      command: 'lerna-version',
    },
    clean: {
      ...config.clean,

      /**
       * @return {string} - command string
       */
      command: () =>
        [
          `lerna exec 'rm -rf lib flow-typed/npm' --parallel`,
          `lerna exec 'rm -rf .flowconfig' --parallel ${findCustomFlowConfigs()}`,
          'lerna clean',
          `${extendCommand(config.clean?.command, 'rm -rf')} ./.changelog`,
        ].join(' && '),
    },
  }),
};
