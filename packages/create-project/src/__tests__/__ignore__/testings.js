// @flow

import path from 'path';

export type inquirerResultType = {
  // base
  action: 'overwrite',

  // pkg
  keywords: [string],
  private: boolean,
  [string]: string,

  // npm
  useNpm: boolean,

  // server
  useServer: boolean,

  // react
  useReact: boolean,
};

export type contextType = {
  lerna?: boolean,
};

const basicUsage = {
  name: 'basic-usage',
  inquirerResult: {
    // base
    action: 'overwrite',

    // pkg
    private: false,
    description: 'package description',
    homepage: 'http://cat-org/package-homepage',
    repository: 'https://github.com/cat-org/core.git',
    keywords: ['keyword'],

    // npm
    useNpm: false,

    // server
    useServer: false,

    // react
    useReact: false,
  },
  cmds: [
    // For getting user information
    'git config --get user.name',
    'git config --get user.email',
    'git config --get user.name',
    'git config --get user.email',
    'git config --get user.name',
    'git config --get user.email',

    // Run commands
    'yarn add --dev @cat-org/configs',
    'configs --install babel',
    'configs --install prettier',
    'configs --install lint',
    'configs --install lint-staged',
    'configs --install jest',
    'yarn add --dev flow-bin flow-typed',
    'yarn flow-typed install',

    // check git status
    'git status',
  ],
};

const privatePkg = {
  name: 'private-pkg',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    private: true,
  },
  cmds: basicUsage.cmds,
};

const useNpm = {
  name: 'use-npm',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useNpm: true,
  },
  cmds: basicUsage.cmds,
};

const useServer = {
  name: 'use-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 6),
    'yarn add --dev @cat-org/server @cat-org/default-middleware',
    ...basicUsage.cmds.slice(6),
  ],
};

const useReactServer = {
  name: 'use-react-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 6),
    'yarn add --dev @cat-org/server @cat-org/default-middleware',
    ...basicUsage.cmds.slice(6, 13),
    '@cat-org/react-middleware',
    ...basicUsage.cmds.slice(13),
  ],
};

const lernaBasicUsage = {
  name: 'lerna/basic-usage',
  inquirerResult: basicUsage.inquirerResult,
  cmds: basicUsage.cmds.slice(0, 6),
  context: {
    lerna: true,
  },
};

const lernaUseNpm = {
  name: 'lerna/private-pkg',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    private: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

export default [
  basicUsage,
  privatePkg,
  useNpm,
  useServer,
  useReactServer,
  lernaBasicUsage,
  lernaUseNpm,
].reduce(
  (
    result: $ReadOnlyArray<
      [string, string, inquirerResultType, $ReadOnlyArray<string>, contextType],
    >,
    {
      name,
      inquirerResult,
      cmds,
      context = {},
    }: {|
      name: string,
      inquirerResult: inquirerResultType,
      cmds: $ReadOnlyArray<string>,
      context?: contextType,
    |},
  ) => [
    ...result,
    [name, path.resolve(__dirname, name), inquirerResult, cmds, context],
  ],
  [],
);
