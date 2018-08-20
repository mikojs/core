// @flow

import pkg from 'utils/pkg';

export default node => {
  node.data.content = `# node
node_modules

# babel
lib

# flow
flow-typed/npm

# jest
coverage

# add checking other configs
!.*.js
`;

  /**
   * NODE_ENV=test for babel-eslint.
   * `babel` ignore __tests__ folder normally, and not ignore in the testing mode.
  */
  pkg.scripts = {
    ...pkg.scripts,
    lint: 'NODE_ENV=test esw --cache --ext .js',
    'lint:watch': 'yarn lint -w --rule \"prettier/prettier: off\" --quiet',
  };

  pkg.dependencies = {
    ...pkg.dependencies,
    '@cat-org/eslint-config-cat': true,
    'eslint': true,
    'eslint-watch': true,
    'babel-eslint': true,
    'eslint-config-fbjs': true,
    'eslint-config-google': true,
    'eslint-config-prettier': true,
    'eslint-import-resolver-babel-module': true,
    'eslint-plugin-babel': true,
    'eslint-plugin-flowtype': true,
    'eslint-plugin-import': true,
    'eslint-plugin-jsdoc': true,
    'eslint-plugin-jsx-a11y': true,
    'eslint-plugin-prettier': true,
    'eslint-plugin-react': true,
    'eslint-plugin-relay': true,
  };
};
