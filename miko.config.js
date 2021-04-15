const path = require('path');

const gitBranch = require('git-branch');

const runLernaCommand = command =>
  `${command} && lerna exec "${command}" --stream --concurrency 1`;

module.exports = {
  babel: {
    description: 'Build source code with babel.',
    action:
      'babel src -d lib --delete-dir-on-start --verbose --root-mode upward',
  },
  dev: {
    description: 'Run development mode.',
    action: () =>
      `lerna exec "miko babel -w" --parallel --stream --since ${
        gitBranch.sync()?.replace(/Branch: /, '') || 'main'
      }`,
  },
  build: {
    description: 'Run build mode.',
    action: 'lerna exec "miko babel" --parallel --stream',
  },
  prod: {
    description: 'Run production mode.',
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
  flow: {
    description: 'Run flow in monorepo.',
    action: runLernaCommand('flow --quiet'),
  },
  lerna: {
    description: 'Run lerna.',
    commands: {
      link: {
        description: 'Link something in monorepo.',
        commands: {
          bin: {
            description: 'Link bin files in monorepo.',
            action: 'lerna-run link-bin',
          },
          flow: {
            description: 'Link flow files in monorepo.',
            action: 'lerna-run link-flow',
          },
        },
      },
    },
  },
  'flow-typed': {
    description: 'Run flow-typed.',
    commands: {
      install: {
        description: 'Run flow-typed install in monorepo.',
        action: () =>
          runLernaCommand(
            `flow-typed install --verbose --flowVersion=${
              require(path.resolve(
                require.resolve('flow-bin'),
                '../package.json',
              )).version
            }`,
          ),
      },
    },
  },
};
