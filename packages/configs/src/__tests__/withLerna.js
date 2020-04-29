// @flow

import withLerna from '../withLerna';

jest.mock('cosmiconfig', () => ({
  cosmiconfigSync: jest.fn().mockReturnValue({
    search: jest.fn().mockReturnValue(),
  }),
}));

describe('with lerna', () => {
  test.each`
    cliName               | ci         | expected
    ${'flow'}             | ${'true'}  | ${"flow --quiet && flow stop && lerna exec 'flow --quiet && flow stop' --stream --concurrency 1"}
    ${'flow'}             | ${'false'} | ${"flow --quiet && lerna exec 'flow --quiet' --stream --concurrency 1"}
    ${'babel'}            | ${'true'}  | ${' --config-file babel.config.js'}
    ${'dev'}              | ${'true'}  | ${'lerna exec "miko babel -w" --stream --since master'}
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
