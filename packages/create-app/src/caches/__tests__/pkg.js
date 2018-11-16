// @flow

import { inquirer } from 'inquirer';

import pkg, { defaultValidate, questions } from '../pkg';

/**
 * @example
 * notFind('')
 *
 * @param {string} argu - function argument
 */
const notFind = (argu: string) => {
  throw new Error('not find');
};

describe('pkg', () => {
  test.each`
    isPrivate
    ${false}
    ${true}
  `(
    'get pkg with private = $isPrivate',
    async ({ isPrivate }: { isPrivate: true }): Promise<void> => {
      pkg.isInit = false;
      inquirer.result = {
        private: isPrivate,
      };

      delete pkg.store.private;
      delete pkg.store.publishConfig;

      expect(await pkg.get('test')).toEqual({
        name: 'test',
        author: 'git config --get user.name <git config --get user.email>',
        engines: {
          node: '>= node version',
          npm: '>= npm version',
          yarn: '>= yarn version',
        },
        license: 'MIT',
        version: '1.0.0',
        main: './lib/index.js',
        husky: {
          hooks: {
            'pre-commit': 'configs-scripts lint-staged && yarn flow',
          },
        },
        ...(isPrivate
          ? {
              private: true,
            }
          : {
              publishConfig: {
                access: 'public',
              },
            }),
      });
    },
  );

  describe('default validate', () => {
    test.each`
      value      | expected
      ${''}      | ${'can not be empty'}
      ${'value'} | ${true}
    `(
      '$value',
      ({ value, expected }: { value: string, expected: string | boolean }) => {
        expect(defaultValidate(value)).toBe(expected);
      },
    );
  });

  describe('questions', () => {
    describe('validate', () => {
      describe.each`
        questionName    | success                                      | fail  | errorMessage
        ${'homepage'}   | ${'https://cat.org'}                         | ${''} | ${'must be url, for example: https://cat.org'}
        ${'repository'} | ${'https://github.com/cat-org/cat-core.git'} | ${''} | ${'must be url or git ssh, for example: https://github.com/cat-org/cat-core.git'}
        ${'keywords'}   | ${['keyword']}                               | ${[]} | ${'can not be empty'}
      `(
        '$questionName',
        ({
          questionName,
          success,
          fail,
          errorMessage,
        }: {
          questionName: string,
          success: string & $ReadOnlyArray<string>,
          fail: string & $ReadOnlyArray<string>,
          errorMessage: string,
        }) => {
          const { validate = notFind } =
            questions.find(
              ({ name }: { name: string }) => name === questionName,
            ) || {};

          it('success', () => {
            expect(validate(success)).toBe(true);
          });

          it('fail', () => {
            expect(validate(fail)).toBe(errorMessage);
          });
        },
      );
    });

    describe('filter', () => {
      it('keywords', () => {
        const { filter = notFind } =
          questions.find(({ name }: { name: string }) => name === 'keywords') ||
          {};

        expect(filter('keyword')).toEqual(['keyword']);
      });
    });
  });
});
