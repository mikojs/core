// @flow

import path from 'path';

export type inquirerResultType = {
  [string]: string,
  private: boolean,
  useNpm: boolean,
  keywords: [string],
};

const basicUsage = {
  name: 'basic-usage',
  inquirerResult: {
    private: false,
    description: 'package description',
    homepage: 'http://cat-org/package-homepage',
    repository: 'https://github.com/cat-org/core.git',
    keywords: ['keyword'],
    useNpm: false,
  },
  cmds: [
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
  ],
};

const useNpm = {
  name: 'use-npm',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useNpm: true,
  },
  cmds: basicUsage.cmds,
};

const privatePkg = {
  name: 'private-pkg',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    private: true,
  },
  cmds: basicUsage.cmds,
};

export default [basicUsage, useNpm, privatePkg].reduce(
  (
    result: $ReadOnlyArray<
      [string, string, inquirerResultType, $ReadOnlyArray<string>],
    >,
    {
      name,
      inquirerResult,
      cmds,
    }: {|
      name: string,
      inquirerResult: inquirerResultType,
      cmds: $ReadOnlyArray<string>,
    |},
  ) => [...result, [name, path.resolve(__dirname, name), inquirerResult, cmds]],
  [],
);
