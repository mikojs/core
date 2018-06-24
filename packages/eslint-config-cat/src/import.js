// @flow

import { invariant } from 'fbjs';

import type { configType } from './definitions/configType.js.flow';

/**
 * extends eslint-import-resolver, eslint-import-resolver-babel-module
 * repo: https://github.com/tleunen/eslint-import-resolver-babel-module
 */

/**
 * @example
 * checImport({
 *   rules: {},
 * });
 *
 * @param {config} config - eslint config
 */
export const checkImport = (config: configType) => {
  invariant(
    Object.keys(config?.rules || {}).includes('import/no-restricted-paths'),
    'You should include "import/no-restricted-paths"',
  );
};

export default {
  extends: ['plugin:import/errors', 'plugin:import/warnings'],
  settings: {
    'import/resolver': {
      node: {},
      'babel-module': {},
    },
  },
  rules: {
    'import/no-unresolved': 'error',
    'import/default': 'error',
    'import/namespace': [
      'error',
      {
        allowComputed: true,
      },
    ],
    // TODO wait project plugin: 'import/no-restricted-paths': 'error',
    'import/no-absolute-path': 'error',
    'import/no-internal-modules': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',

    'import/no-named-as-default-member': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-mutable-exports': 'error',

    'import/first': 'error',
    'import/exports-last': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'error',
    'import/newline-after-import': 'error',
    'import/prefer-default-export': 'error',
    'import/no-named-default': 'error',
    'import/group-exports': 'error',
  },
};
