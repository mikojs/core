// @flow

import gitBranch from 'git-branch';
import { cosmiconfigSync } from 'cosmiconfig';
import { emptyFunction } from 'fbjs';

import configs from './configs';

const cosmiconfigOptions = {
  loaders: {
    '.js': emptyFunction.thatReturnsArgument,
  },
};
const newConfigs = {
  babel: {
    install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...install,
      '-W',
    ],
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
      [
        ...argv,
        '--config-file',
        cosmiconfigSync('babel', cosmiconfigOptions).search()?.filepath,
      ].filter(Boolean),
  },
  server: {
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
      [
        ...argv,
        '--config-file',
        cosmiconfigSync('babel', cosmiconfigOptions).search()?.filepath,
      ].filter(Boolean),
  },
  miko: <
    C: {
      [string]: {| command: string | (() => string), description: string |},
      clean: { command: string, description: string },
      build: { command: string, description: string },
    },
  >(
    config: C,
  ): C => ({
    ...config,
    flow: {
      command: `lerna exec 'flow --quiet${
        process.env.CI ? ' && flow stop' : ''
      }' --stream --concurrency 1`,
      description: 'run `flow` with the lerna command',
    },
    'flow-typed:install': {
      ...config['flow-typed:install'],
      command: [
        config['flow-typed:install'].command,
        'flow-mono create-symlinks .flowconfig',
        'flow-mono install-types ----ignoreDeps=peer',
      ].join(' && '),
    },
    babel: {
      command: () =>
        `${config.build.command} --config-file ${cosmiconfigSync(
          'babel',
          cosmiconfigOptions,
        ).search()?.filepath || 'babel.config.js'}`,
      description: 'run `babel` in the package of the monorepo',
    },
    build: {
      ...config.build,
      command: 'lerna exec "miko babel" --stream',
    },
    dev: {
      ...config.dev,
      command: (): string => {
        const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'master';

        return `lerna exec "miko babel -w" --stream --since ${branch}`;
      },
    },
    prod: {
      ...config.prod,
      command: 'NODE_ENV=production && lerna exec "miko babel" --stream',
    },
    'husky:pre-commit': {
      ...config['husky:pre-commit'],
      command: (): string => {
        const branch = gitBranch.sync()?.replace(/Branch: /, '') || 'master';

        return `miko build --since ${branch} && lint-staged && miko flow --since ${branch}`;
      },
    },
    'husky:post-merge': {
      ...config['husky:post-merge'],
      command: 'miko build',
    },
    'husky:post-checkout': {
      ...config['husky:post-checkout'],
      command: 'miko build --since master',
    },
    release: {
      ...config.release,
      command: [
        'lerna-changelog',
        'echo "\nContinue with any keyword or exit with "ctrl + c"..."',
        'read -p ""',
        'vim CHANGELOG.md',
        'git add CHANGELOG.md',
        'git commit -m "chore(root): add CHANGELOG.md"',
        'lerna version',
      ].join(' && '),
    },
    clean: {
      ...config.clean,
      command: `lerna exec 'rm -rf lib flow-typed/npm .flowconfig' && lerna clean && ${config.clean.command} ./.changelog`,
    },
  }),
  exec: {
    install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...install.filter((key: string) => key !== 'standard-version'),
      'lerna',
      'lerna-changelog',
      'git-branch',
      'flow-mono-cli',
    ],
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> =>
      argv.reduce(
        (newArgv: $ReadOnlyArray<string>, argvStr: string) => [
          ...newArgv,
          ...(argvStr === '--changed' && /^lerna:/.test(argv[0])
            ? ['--since', gitBranch.sync()?.replace(/Branch: /, '') || 'master']
            : [argvStr]),
        ],
        [],
      ),
    config: ({
      clean,
      ...config
    }: {
      clean?: $ReadOnlyArray<string>,
    }): {
      lerna: {
        [string]: $ReadOnlyArray<string>,
        'flow-typed': {
          [string]: $ReadOnlyArray<string>,
        },
      },
    } => ({
      ...config,

      // lerna
      lerna: {
        // flow
        flow: [
          'lerna',
          'exec',
          `"flow --quiet${process.env.CI ? ' && flow stop' : ''}"`,
          '--stream',
          '--concurrency',
          '1',
        ],

        // flow-typed
        'flow-typed': {
          install: [
            'exec:flow-typed:install',
            '&&',
            'flow-mono',
            'create-symlinks',
            '.flowconfig',
            '&&',
            'flow-mono',
            'install-types',
            '--ignoreDeps=peer',
          ],
        },

        // babel
        babel: ['lerna', 'exec', '"configs babel"', '--stream'],
        'babel:watch': [
          'lerna',
          'exec',
          '"configs babel -w"',
          '--stream',
          '--parallel',
        ],
      },

      // husky
      husky: {
        'pre-commit': [
          'exec:lerna:babel',
          '--since',
          gitBranch.sync()?.replace(/Branch: /, '') || 'master',
          '&&',
          'configs',
          'lint-staged',
          '&&',
          'exec:lerna:flow',
          '--since',
          gitBranch.sync()?.replace(/Branch: /, '') || 'master',
        ],

        'post-merge': ['exec:lerna:babel'],

        'post-checkout': ['exec:lerna:babel', '--since', 'master'],
      },

      // release
      release: [
        'lerna-changelog',
        '&&',
        'echo',
        '\nContinue with any keyword or exit with "ctrl + c"...',
        '&&',
        'read',
        '-p',
        '',
        '&&',
        'vim',
        'CHANGELOG.md',
        '&&',
        'git',
        'add',
        'CHANGELOG.md',
        '&&',
        'git',
        'commit',
        '-m',
        'chore(root): add CHANGELOG.md',
        '&&',
        'lerna',
        'version',
      ],

      // clean
      clean: [
        'lerna',
        'exec',
        '"rm -rf lib flow-typed/npm .flowconfig"',
        '&&',
        'lerna',
        'clean',
        '&&',
        ...(clean || ['rm', '-rf']),
        './.changelog',
      ],
    }),
  },
};

export default Object.keys(configs).reduce(
  (
    result: {
      [string]: {
        install: (install: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
      },
      ...typeof newConfigs,
    },
    key: $Keys<typeof configs>,
  ) =>
    Object.keys(result).includes(key)
      ? result
      : {
          ...result,
          [key]: {
            install: (install: $ReadOnlyArray<string>) => [...install, '-W'],
          },
        },
  newConfigs,
);
