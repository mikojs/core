// @flow

import prettier from './prettier';

export default {
  extends: ['@cat-org/eslint-config-cat'],
  rules: {
    'prettier/prettier': ['error', prettier],
  },
};
