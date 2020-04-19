// @flow

import withLerna from '../withLerna';

jest.mock('cosmiconfig', () => ({
  cosmiconfigSync: jest.fn().mockReturnValue({
    search: jest.fn().mockReturnValue(),
  }),
}));

describe('with lerna', () => {
  beforeAll(() => {
    process.env.CI = 'true';
  });

  test.each`
    cliName               | expected
    ${'flow'}             | ${"lerna exec 'flow --quiet && flow stop' --stream --concurrency 1"}
    ${'babel'}            | ${' --config-file babel.config.js'}
    ${'dev'}              | ${'lerna exec "miko babel -w" --stream --since master'}
    ${'husky:pre-commit'} | ${'miko build --since master && miko flow --since master && lint-staged'}
  `(
    'run miko with cliName = $cliName',
    ({ cliName, expected }: {| cliName: string, expected: string |}) => {
      const { command } = withLerna.miko({
        clean: { command: '', description: '' },
        build: { command: '', description: '' },
      })[cliName];

      expect(typeof command === 'string' ? command : command()).toBe(expected);
    },
  );
});
