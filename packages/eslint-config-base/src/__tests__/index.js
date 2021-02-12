// @flow

import { ESLint } from 'eslint';

import configs from '../index';

import testings, { type testingType } from './__ignore__/testings';

type messageType = {| ruleId: string |};

describe('eslint config base', () => {
  test.each(testings)(
    '%s',
    async (
      name: $ElementType<testingType, 0>,
      code: $ElementType<testingType, 1>,
      rules: $ElementType<testingType, 2>,
    ) => {
      const [{ messages }] = await new ESLint({
        baseConfig: configs,
        useEslintrc: false,
      }).lintText(code);

      messages
        .filter(
          ({ ruleId }: messageType) =>
            ![
              'no-unused-vars',
              'no-warning-comments',
              'prettier/prettier',
            ].includes(ruleId),
        )
        .forEach((message: messageType, index: number) => {
          expect(message).toEqual(expect.objectContaining(rules[index]));
        });
    },
  );
});
