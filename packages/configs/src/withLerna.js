// @flow

import path from 'path';

import gitBranch from 'git-branch';

import { requireModule } from '@mikojs/utils';
import { type mikoConfigsType } from '@mikojs/miko';

import extendCommand from './normalize/extendCommand';

type pkgType = {| version: string |};

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
    'flow-typed:install': {
      ...config['flow-typed:install'],

      /**
       * @return {string} - command string
       */
      command: () =>
        [
          extendCommand(
            config['flow-typed:install']?.command,
            'flow-typed install --verbose',
          ),
          'lerna-helper link-flow',
          `lerna exec "flow-typed install --ignoreDeps=peer --flowVersion=${
            requireModule<pkgType>(
              path.resolve(require.resolve('flow-bin'), '../package.json'),
            ).version
          }" --stream`,
        ].join(' && '),
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
      command: 'lerna-helper release',
    },
    clean: {
      ...config.clean,

      /**
       * @return {string} - command string
       */
      command: () =>
        [
          'lerna-helper link-flow --remove',
          'lerna-helper link-bin --remove',
          `lerna exec 'rm -rf lib flow-typed/npm' --parallel`,
          'lerna clean',
          `${extendCommand(config.clean?.command, 'rm -rf')} ./.changelog`,
        ].join(' && '),
    },
  }),
};
