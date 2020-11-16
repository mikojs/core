// @flow

import gitBranch from 'git-branch';

import flowTypedCache from './utils/flowTypedCache';

export default {
  /**
   * @param {object} config - prev miko config
   *
   * @return {object} - new miko config
   */
  miko: <
    C: {
      [string]: {| command: string | (() => string), description: string |},
      clean: { command: string, description: string },
      build: { command: string, description: string },
    },
  >(
    config: C,
  ): C => ({
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
      description: 'run `flow` with the lerna command',
    },
    'flow-typed:save-cache': {
      command: flowTypedCache.save,
      description: 'save flow-typed in the cache folder',
    },
    'flow-typed:restore-cache': {
      command: flowTypedCache.restore,
      description: 'restore flow-typed from the cache folder',
    },
    'flow-typed:install': {
      ...config['flow-typed:install'],
      command: [
        config['flow-typed:install']?.command,
        'flow-mono create-symlinks .flowconfig',
        'flow-mono install-types ----ignoreDeps=peer',
      ]
        .filter(Boolean)
        .join(' && '),
    },
    babel: {
      command: `${
        config.build?.command || 'babel src -d lib --verbose'
      } --root-mode upward`,
      description: 'run `babel` in the package of the monorepo',
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
        const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'master';

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
        const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'master';

        return `miko build --since ${branch} && miko flow --since ${branch} && lint-staged`;
      },
    },
    'husky:post-merge': {
      ...config['husky:post-merge'],
      command: 'miko build',
    },
    'husky:post-checkout': {
      ...config['husky:post-checkout'],
      command: 'miko build --since master',
    },
    release: {
      ...config.release,
      command: [
        'lerna-changelog',
        'echo "\nContinue with any keyword or exit with "ctrl + c"..."',
        'read -p ""',
        'vim CHANGELOG.md',
        'git add CHANGELOG.md',
        'git commit -m "chore(root): add CHANGELOG.md"',
        'lerna version',
      ].join(' && '),
    },
    clean: {
      ...config.clean,
      command: `lerna exec 'rm -rf lib flow-typed/npm .flowconfig' --parallel && lerna clean && ${
        config.clean?.command || 'rm -rf'
      } ./.changelog`,
    },
  }),
};
