// @flow

/**
 * @example
 * miko()
 *
 * @return {object} - miko default config
 */
export default () => ({
  build: {
    command: 'babel src -d lib --verbose',
    description: 'run `babel` in the build mode',
  },
  dev: {
    command: 'miko build -w',
    description: 'run `babel` in the dev mode',
  },
  prod: {
    command: 'NODE_ENV=production miko build',
    description: 'run `babel` in the production mode',
  },
  prettier: {
    command: 'prettier --write',
    description: 'run `prettier` with `--write` option',
  },
  lint: {
    command: 'esw --cache --color',
    description: 'run `eslint` with generating the cache',
  },
  'lint:watch': {
    command: 'miko lint -w --quiet --rule "prettier/prettier: off"',
    description: 'run `eslint` in the watch mode',
  },
  jest: {
    command: 'jest --coverage=false',
    description: 'run `jest` without generating the coverage',
  },
  test: {
    command: 'jest --silent',
    description: 'run `jest` in the silent mode',
  },
  'flow-typed:install': {
    command: 'flow-typed install --verbose',
    description: 'flow-typed install',
  },
  'husky:pre-commit': {
    command: 'miko build && miko lint-staged && flow',
    description: 'checking the code style before running `git commit`',
  },
  'husky:post-merge': {
    command: 'miko build',
    description: 'rebuild the package after running `git merge`',
  },
  'husky:post-checkout': {
    command: 'miko build',
    description: 'rebuild the package after running `git checkout`',
  },
  release: {
    command: 'standard-version',
    description: 'set the tag and release a new version',
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
    description: 'clean the built files',
  },
});
