// @flow

import pkg, { pkgQuestions } from '../pkg';

/**
 * @example
 * notFind('')
 *
 * @param {string} argu - function argument
 */
const notFind = (argu: string) => {
  throw new Error('not find');
};

pkg.ctx = { projectDir: 'project dir' };

describe('pkg store', () => {
  describe('validate', () => {
    describe.each`
      questionName    | success                                  | fail  | errorMessage
      ${'homepage'}   | ${'https://cat.org'}                     | ${''} | ${'must be url, for example: https://cat.org'}
      ${'repository'} | ${'https://github.com/cat-org/core.git'} | ${''} | ${'must be url or git ssh, for example: https://github.com/cat-org/core.git'}
      ${'keywords'}   | ${['keyword']}                           | ${[]} | ${'can not be empty'}
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
          pkgQuestions.find(
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
        pkgQuestions.find(
          ({ name }: { name: string }) => name === 'keywords',
        ) || {};

      expect(filter('keyword')).toEqual(['keyword']);
    });
  });
});
