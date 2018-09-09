// @flow

import prettier from 'configs/prettier';

export default {
  extends: ['@cat-org/eslint-config-cat'],
  rules: {
    'prettier/prettier': ['error', prettier],
  },
};
