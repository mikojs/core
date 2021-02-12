// @flow

import { ESLint } from 'eslint';

import configs from '../index';

import testings, { type testingType } from './__ignore__/testings';

type messageType = {| ruleId: string |};

const ruleIds = [];

// use to mock worker in @mikojs/miko/src/index.js
jest.mock('@mikojs/worker', () =>
  jest.fn().mockResolvedValue({
    addTracking: jest.fn(),
  }),
);

describe('eslint config base', () => {
  test.each(testings)(
    '%s',
    async (
      name: $ElementType<testingType, 0>,
      filePath: $ElementType<testingType, 1>,
      code: $ElementType<testingType, 2>,
      rules: $ElementType<testingType, 3>,
    ) => {
      const [{ messages }] = await new ESLint({
        baseConfig: configs,
        useEslintrc: false,
        ignore: false,
      }).lintText(code, { filePath });
      const expected = messages
        .filter(
          ({ ruleId }: messageType) =>
            ![
              'no-unused-vars',
              'no-warning-comments',
              'prettier/prettier',
            ].includes(ruleId),
        )
        .sort((a: messageType, b: messageType) =>
          a.line === b.line
            ? a.ruleId.localeCompare(b.ruleId)
            : a.line - b.line,
        );

      expected.forEach((message: messageType, index: number) => {
        expect(message).toEqual(expect.objectContaining(rules[index]));

        if (!ruleIds.includes(message.ruleId)) ruleIds.push(message.ruleId);
      });
      expect(expected.length).toBe(rules.length);
    },
  );

  test('check rules have been checked', () => {
    expect(ruleIds.sort()).toEqual(
      Object.keys(configs?.rules || {})
        .filter((ruleName: string): boolean =>
          configs?.rules?.[ruleName] === 'warn'
            ? false
            : {
                'arrow-parens': !ruleIds.includes(
                  'flowtype/require-parameter-type',
                ),
                'require-jsdoc': !ruleIds.includes('jsdoc/require-jsdoc'),
                'flowtype/no-flow-fix-me-comments': false,
                'flowtype/generic-spacing': false,
                'no-warning-comments': false,
                'no-invalid-this': false,
                'babel/no-invalid-this': false,
                'valid-jsdoc': false,
              }[ruleName] ?? true,
        )
        .sort(),
    );
  });
});
