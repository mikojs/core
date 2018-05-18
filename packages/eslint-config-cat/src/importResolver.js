// @flow

/**
 * extends eslint-import-resolver, eslint-import-resolver-babel-module
 * repo: https://github.com/tleunen/eslint-import-resolver-babel-module
*/

export default {
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  settings: {
    'import/resolver': {
      node: {},
      'babel-module': {},
    },
  },
};
