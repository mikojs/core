// @flow

import withLerna from '../withLerna';

describe('with lerna', () => {
  test.each`
    cliName               | ci         | expected
    ${'flow'}             | ${'true'}  | ${"flow --quiet && flow stop && lerna exec 'flow --quiet && flow stop' --stream --concurrency 1"}
    ${'flow'}             | ${'false'} | ${"flow --quiet && lerna exec 'flow --quiet' --stream --concurrency 1"}
    ${'dev'}              | ${'true'}  | ${'lerna exec "miko babel -w" --parallel --stream --since master'}
    ${'husky:pre-commit'} | ${'true'}  | ${'miko build --since master && miko flow --since master && lint-staged'}
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
