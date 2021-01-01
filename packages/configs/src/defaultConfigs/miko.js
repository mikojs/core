// @flow

import { type mikoConfigsType } from '@mikojs/miko';

/**
 * @return {mikoConfigsType} - miko default config
 */
export default (): mikoConfigsType => ({
  babel: {
    command: 'babel src -d lib --verbose --root-mode upward',
    description: 'Run babel with the default folder.',
  },
  build: {
    command: 'miko babel',
    description: 'Run `babel` in the build mode.',
  },
  dev: {
    command: 'miko babel -w',
    description: 'Run `babel` in the development mode.',
  },
  prod: {
    command: 'NODE_ENV=production miko babel',
    description: 'Run `babel` in the production mode.',
  },
  prettier: {
    command: 'prettier --write',
    description: 'Run `prettier` with `--write` option.',
  },
  lint: {
    command: 'esw --cache --color',
    description: 'Run `eslint` with generating the cache.',
  },
  'lint:watch': {
    command: 'miko lint -w --quiet --rule "prettier/prettier: off"',
    description: 'Run `eslint` in the watch mode.',
  },
  jest: {
    command: 'jest --silent',
    description: 'Run `jest` in the silent mode.',
  },
  'jest:watch': {
    command: 'jest --coverage=false --watchAll',
    description: 'Run `jest` without generating the coverage.',
  },
  'flow-typed:install': {
    command: 'flow-typed install --verbose',
    description: 'Install flow-typed files.',
  },
  'husky:pre-commit': {
    command: 'miko build && flow && miko lint-staged',
    description: 'Check the code style before running `git commit`.',
  },
  'husky:post-merge': {
    command: 'miko build',
    description: 'Rebuild the package after running `git merge`.',
  },
  'husky:post-checkout': {
    command: 'miko build',
    description: 'Rebuild the package after running `git checkout`.',
  },
  release: {
    command: 'standard-version',
    description: 'Set the tag and release a new version.',
  },
  clean: {
    command: [
      'rm',
      '-rf',
      './flow-typed/npm',
      './coverage',
      './.eslintcache',
      './*.log',
      './node_modules',
    ].join(' '),
    description: 'Clean the built files.',
  },
});
