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

  // graphql
  useGraphql: boolean,

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

    // react
    useReact: false,

    // graphql
    useGraphql: false,

    // useStyles
    useStyles: false,
  },
};

const privatePkg = {
  name: 'private-pkg',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    private: true,
  },
};

const npmPkg = {
  name: 'npm-pkg',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useNpm: true,
  },
};

const basicServer = {
  name: 'basic-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
  },
};

const reactServer = {
  name: 'react-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
  },
};

const reactServerWithCss = {
  name: 'react-server-with-css',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'css',
  },
};

const reactServerWithLess = {
  name: 'react-server-with-less',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'less',
  },
};

const graphqlServer = {
  name: 'graphql-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useGraphql: true,
  },
};

const relayServer = {
  name: 'relay-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useGraphql: true,
  },
};

// with --lerna
const lernaBasicUsage = {
  name: 'lerna/basic-usage',
  inquirerResult: basicUsage.inquirerResult,
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
  context: {
    lerna: true,
  },
};

const lernaNpmPkg = {
  name: 'lerna/npm-pkg',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useNpm: true,
  },
  context: {
    lerna: true,
  },
};

const lernaBasicServer = {
  name: 'lerna/basic-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
  },
  context: {
    lerna: true,
  },
};

const lernaReactServer = {
  name: 'lerna/react-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
  },
  context: {
    lerna: true,
  },
};

const lernaReactServerWithCss = {
  name: 'lerna/react-server-with-css',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'css',
  },
  context: {
    lerna: true,
  },
};

const lernaReactServerWithLess = {
  name: 'lerna/react-server-with-less',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'less',
  },
  context: {
    lerna: true,
  },
};

const lernaGraphqlServer = {
  name: 'lerna/graphql-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useGraphql: true,
  },
  context: {
    lerna: true,
  },
};

const lernaRelayServer = {
  name: 'lerna/relay-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useGraphql: true,
  },
  context: {
    lerna: true,
  },
};

export default [
  basicUsage,
  privatePkg,
  npmPkg,
  basicServer,
  reactServer,
  reactServerWithCss,
  reactServerWithLess,
  graphqlServer,
  relayServer,

  lernaBasicUsage,
  lernaPrivatePkg,
  lernaNpmPkg,
  lernaBasicServer,
  lernaReactServer,
  lernaReactServerWithCss,
  lernaReactServerWithLess,
  lernaGraphqlServer,
  lernaRelayServer,
].reduce(
  (
    result: $ReadOnlyArray<[string, string, inquirerResultType, contextType]>,
    {
      name,
      inquirerResult,
      context = {},
    }: {|
      name: string,
      inquirerResult: inquirerResultType,
      context?: contextType,
    |},
  ) => [
    ...result,
    [name, path.resolve(__dirname, name), inquirerResult, context],
  ],
  [],
);
