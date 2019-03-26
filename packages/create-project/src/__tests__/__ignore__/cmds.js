// @flow

export default [
  // For getting user information
  'git config --get user.name',
  'git config --get user.email',

  // Run commands
  'git init',
  'yarn add --dev @cat-org/configs@beta',
  'configs --install babel',
  'configs --install prettier',
  'configs --install lint',
  'configs --install lint-staged',
  'configs --install jest',
  'yarn add --dev flow-bin flow-typed',
  'yarn flow-typed install',
  'git add .',
  'git commit -m "chore(root): project init"',
  'git remote add origin https://github.com/cat-org/core.git',
];
