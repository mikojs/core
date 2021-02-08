// @flow

import withLerna from '../withLerna';

describe('with lerna', () => {
  test.each`
    cliName                 | ci         | expected
    ${'flow'}               | ${'true'}  | ${"flow stop && flow --quiet && flow stop && lerna exec 'flow stop && flow --quiet && flow stop' --stream --concurrency 1"}
    ${'flow'}               | ${'false'} | ${"flow --quiet && lerna exec 'flow --quiet' --stream --concurrency 1"}
    ${'flow-typed:install'} | ${'true'}  | ${'flow-typed install --verbose && lerna-helper link-flow && lerna exec "flow-typed install --ignoreDeps=peer --flowVersion=0.141.0" --stream'}
    ${'dev'}                | ${'true'}  | ${'lerna exec "miko babel -w" --parallel --stream --since main'}
    ${'husky:pre-commit'}   | ${'true'}  | ${'miko build --since main && miko flow --since main && lint-staged'}
    ${'clean'}              | ${'true'}  | ${`lerna-helper link-flow --remove && lerna-helper link-bin --remove && lerna exec 'rm -rf lib flow-typed/npm' --parallel && lerna clean && rm -rf ./.changelog`}
  `(
    'run miko with cliName = $cliName',
    ({
      cliName,
      ci,
      expected,
    }: {|
      cliName: string,
      ci: string,
      expected: string,
    |}) => {
      process.env.CI = ci;

      const { command } = withLerna.miko({
        clean: { command: '', description: '' },
        build: { command: '', description: '' },
      })[cliName];

      expect(typeof command === 'string' ? command : command()).toBe(expected);
    },
  );
});
