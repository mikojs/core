// @flow

/**
 * @example
 * miko()
 *
 * @return {object} - miko default config
 */
export default () => ({
  dev: {
    command: 'babel src -d lib --verbose -w',
    description: 'run babel in the dev mode',
  },
  build: {
    command: 'babel src -d lib --verbose',
    description: 'run babel in the build mode',
  },
  prettier: {
    command: 'prettier --write',
    description: 'run prettier with `--write` option',
  },
  lint: {
    command: 'lint --cache',
    description: 'run eslint with generating the cache',
  },
  'lint:watch': {
    command: 'esw --cache --color -w --quiet --rule "prettier/prettier: off"',
    description: 'run eslint in the watch mode',
  },
  jest: {
    command: 'jest --coverage=false',
    description: 'run jest without generating the coverage',
  },
  test: {
    command: 'jest --slient',
    description: 'run jest in the slient mode',
  },
  'flow-typed': {
    command: 'flow-typed install --verbose',
    description: 'flow-typed install',
  },
  'husky:pre-commit': {
    command: 'miko build && miko lint-staged && flow',
    description: 'checking the code style before git commit',
  },
  'husky:post-merge': {
    command: 'miko build',
    description: 'rebuild package after git merge',
  },
  'husky:post-checkout': {
    command: 'miko build',
    description: 'rebuild package after git checkout',
  },
  release: {
    command: 'standard-version',
    description: 'set the tag and release a new version',
  },
});
