// @flow

import withRelay from '../withRelay';

describe('with relay', () => {
  test('lint', () => {
    expect(
      withRelay[1].lint.config({
        rules: {
          'jsdoc/check-tag-names': [
            'error',
            {
              definedTags: [],
            },
          ],
        },
      }),
    ).toEqual({
      rules: {
        'jsdoc/check-tag-names': [
          'error',
          {
            definedTags: ['relay'],
          },
        ],
      },
    });
  });

  test('jest', () => {
    expect(
      withRelay[1].jest.config({
        testPathIgnorePatterns: [],
        coveragePathIgnorePatterns: [],
      }),
    ).toEqual({
      testPathIgnorePatterns: ['__tests__/__generated__'],
      coveragePathIgnorePatterns: ['__generated__'],
    });
  });
});
