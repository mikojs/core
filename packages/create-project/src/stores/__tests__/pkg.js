// @flow

import pkg, { getPkgQuestions } from '../pkg';

/**
 * @example
 * notFind('')
 *
 * @param {string} argu - function argument
 */
const notFind = (argu: string) => {
  throw new Error('not find');
};

describe('pkg store', () => {
  test('can not find the previous package.json', async () => {
    expect(
      await pkg.defaultInfo({
        projectDir: 'projectDir',
        lerna: false,
        skipCommand: false,
        verbose: false,
      }),
    ).toBeUndefined();
  });

  describe('validate', () => {
    describe.each`
      questionName    | success                                 | fail  | errorMessage
      ${'homepage'}   | ${'https://mikojs.github.io'}           | ${''} | ${'must be url, for example: https://mikojs.github.io'}
      ${'repository'} | ${'https://github.com/mikojs/core.git'} | ${''} | ${'must be url or git ssh, for example: https://github.com/mikojs/core.git'}
      ${'keywords'}   | ${['keyword']}                          | ${[]} | ${'can not be empty'}
    `(
      '$questionName',
      ({
        questionName,
        success,
        fail,
        errorMessage,
      }: {|
        questionName: string,
        success: string & $ReadOnlyArray<string>,
        fail: string & $ReadOnlyArray<string>,
        errorMessage: string,
      |}) => {
        const {
          validate = notFind,
        }: {
          validate?: (string & $ReadOnlyArray<string>) => true | string,
        } =
          getPkgQuestions('/', {}).find(
            ({ name }: { name: string }) => name === questionName,
          ) || {};

        test('success', () => {
          expect(validate(success)).toBe(true);
        });

        test('fail', () => {
          expect(validate(fail)).toBe(errorMessage);
        });
      },
    );
  });

  describe('filter', () => {
    test('keywords', () => {
      const {
        filter = notFind,
      }: {
        filter?: string => $ReadOnlyArray<string>,
      } =
        getPkgQuestions('/', {}).find(
          ({ name }: { name: string }) => name === 'keywords',
        ) || {};

      expect(filter('keyword')).toEqual(['keyword']);
    });
  });
});
