const path = require('path');

const execa = require('execa');

const runLernaCommand = command =>
  `${command} && lerna exec "${command}" --stream --concurrency 1`;

const getBranch = async () =>
  (await execa('git', ['branch', '--show-current'])).stdout;

const migration = config =>
  Object.keys(config).reduce(
    (result, key) => ({
      ...result,
      [key]: {
        ...config[key],
        command: config[key].action,
        commands: migration(config[key].commands || {}),
      },
    }),
    {},
  );

module.exports = migration({
  babel: {
    description: 'Build source code with babel.',
    action:
      'babel src -d lib --delete-dir-on-start --verbose --root-mode upward',
  },
  dev: {
    description: 'Run development mode.',
    action: async () =>
      `lerna exec "miko babel -w" --parallel --stream --since ${await getBranch()}`,
  },
  build: {
    description: 'Run build mode.',
    action: 'lerna exec "miko babel" --parallel --stream',
    commands: {
      'yarn-plugins': {
        description: 'Build yarn plugins.',
        action:
          'lerna exec "builder build plugin" --stream --scope @mikojs/yarn-plugin-*',
      },
    },
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
          flow: {
            description: 'Link flow files in monorepo.',
            action: 'lerna exec "yarn flow-typed link" --stream',
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
  husky: {
    description: 'Run husky.',
    commands: {
      'pre-commit': {
        description: 'Run commands in git pre-commit hook.',
        action: async () => {
          const branch = await getBranch();

          return `miko build --since ${branch} && miko flow --since ${branch} && lint-staged`;
        },
      },
      'post-merge': {
        description: 'Run commands in git post-merge hook.',
        action: 'miko build',
      },
      'post-checkout': {
        description: 'Run commands in git post-checkout hook.',
        action: async () => {
          const branch = await getBranch();

          return branch === 'main' ? 'miko build' : 'miko build --since main';
        },
      },
    },
  },
  clean: {
    description: 'Clean ignored files.',
    action: 'git clean -dxf',
  },
});
