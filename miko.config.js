const gitBranch = require('git-branch');

module.exports = {
  babel: {
    description: 'Build source code with babel.',
    action:
      'babel src -d lib --delete-dir-on-start --verbose --root-mode upward',
  },
  dev: {
    description: 'Run development mode',
    action: () => {
      const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'main';

      return `lerna exec "miko babel -w" --parallel --stream --since ${branch}`;
    },
  },
  build: {
    description: 'Run build mode',
    action: 'lerna exec "miko babel" --parallel --stream',
  },
  prod: {
    description: 'Run production mode',
    action: 'NODE_ENV=production && miko build',
  },
  jest: {
    description: 'Test the code with jest.',
    action: 'jest --silent',
    commands: {
      watch: {
        description: 'Run jest in watch mode.',
        action: 'jest --coverage=false --watchAll',
      },
    },
  },
  lint: {
    description: 'Check code style with eslint.',
    action: 'esw --cache --color',
    commands: {
      prettier: {
        description: 'Disable `prettier/prettier` rule for running prettier.',
        action: 'miko lint --quiet --rule "prettier/prettier: off"',
      },
      watch: {
        description: 'Run eslint in watch mode.',
        action: 'miko lint --rule "prettier/prettier: off" -w',
      },
    },
  },
};