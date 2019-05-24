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
  useGraphql: boolean,

  // react
  useReact: boolean,

  // styles
  useStyles: boolean | 'css' | 'less',
};

export type contextType = {
  lerna?: boolean,
};

// basic
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
    useGraphql: false,

    // react
    useReact: false,

    // useStyles
    useStyles: false,
  },
  cmds: [
    // For getting user information
    'git config --get user.name',
    'git config --get user.email',
    'git config --get user.name',
    'git config --get user.email',

    // Run commands
    'yarn add --dev @cat-org/configs',
    'yarn configs --install babel',
    'yarn configs --install prettier',
    'yarn configs --install lint',
    'yarn configs --install lint-staged',
    'yarn configs --install jest',
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
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4),
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
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 10),
    'yarn add --dev enzyme-adapter-react-16',
    ...basicUsage.cmds.slice(10, 11),
    'yarn add react react-dom @cat-org/koa-react',
    'yarn add --dev @babel/preset-react',
    ...basicUsage.cmds.slice(11),
  ],
};

const useReactServerWithCss = {
  name: 'use-react-server-with-css',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'css',
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 10),
    'yarn add --dev enzyme-adapter-react-16',
    ...basicUsage.cmds.slice(10, 11),
    'yarn add react react-dom @cat-org/koa-react',
    'yarn add --dev @babel/preset-react',
    'yarn add @cat-org/use-css',
    'yarn add --dev babel-plugin-css-modules-transform @cat-org/import-css',
    ...basicUsage.cmds.slice(11),
  ],
};

const useReactServerWithLess = {
  name: 'use-react-server-with-less',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'less',
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 10),
    'yarn add --dev enzyme-adapter-react-16',
    ...basicUsage.cmds.slice(10, 11),
    'yarn add react react-dom @cat-org/koa-react',
    'yarn add --dev @babel/preset-react',
    'yarn add @cat-org/use-less',
    'yarn add --dev babel-plugin-css-modules-transform @cat-org/import-css',
    ...basicUsage.cmds.slice(11),
  ],
};

const useGraphqlServer = {
  name: 'use-graphql-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useGraphql: true,
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base @cat-org/koa-graphql',
    ...basicUsage.cmds.slice(4),
  ],
};

// with --lerna
const lernaBasicUsage = {
  name: 'lerna/basic-usage',
  inquirerResult: basicUsage.inquirerResult,
  cmds: basicUsage.cmds.slice(0, 4),
  context: {
    lerna: true,
  },
};

const lernaPrivatePkg = {
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

const lernaUseNpm = {
  name: 'lerna/use-npm',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useNpm: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaUseServer = {
  name: 'lerna/use-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaUseReactServer = {
  name: 'lerna/use-react-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaUseReactServerWithCss = {
  name: 'lerna/use-react-server-with-css',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'css',
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaUseReactServerWithLess = {
  name: 'lerna/use-react-server-with-less',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'less',
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaUseGraphqlServer = {
  name: 'lerna/use-graphql-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useGraphql: true,
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
  useReactServerWithCss,
  useReactServerWithLess,
  useGraphqlServer,

  lernaBasicUsage,
  lernaPrivatePkg,
  lernaUseNpm,
  lernaUseServer,
  lernaUseReactServer,
  lernaUseReactServerWithCss,
  lernaUseReactServerWithLess,
  lernaUseGraphqlServer,
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
