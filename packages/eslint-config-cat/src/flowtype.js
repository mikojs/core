// @flow

/**
 * extends eslint-plugin-flowType
 * repo: https://github.com/gajus/eslint-plugin-flowtype
*/

export default {
  extends: [
    'plugin:flowtype/recommended',
  ],
  rules: {
    'flowtype/no-dupe-keys': 'error',
    'flowtype/no-mutable-array': 'error',
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/no-unused-expressions': 'error',
    'flowtype/no-weak-types': 'error',
    'flowtype/require-parameter-type': 'error',
    'flowtype/require-return-type': ['error', 'always'],
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'flowtype/require-variable-type': ['error', {
      excludeVariableTypes: {
        var: false,
        let: false,
        const: true,
      },
    }],
    'flowtype/type-id-match': ['error', '^([a-z][A-Za-z0-9]*)+Type$'],
  },
};
