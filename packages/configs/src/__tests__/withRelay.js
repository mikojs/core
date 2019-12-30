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
});
