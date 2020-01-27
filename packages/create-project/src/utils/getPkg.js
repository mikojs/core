// @flow

import path from 'path';

import gitUserName from 'git-user-name';
import gitUserEmail from 'git-user-email';
import inquirer from 'inquirer';
import { isURL } from 'validator';

type pkgType = {|
  private?: boolean,
  name?: string,
  license?: string,
  author?: string,
  version?: string,
  main?: string,
  publishConfig?: {
    access: string,
  },
|};

/**
 * @example
 * getPkg('/', {})
 *
 * @param {string} projectDir - project dir path
 * @param {pkgType} originialPkg - original pkg
 *
 * @return {pkgType} - pkg data
 */
export default async (projectDir: string, originialPkg: pkgType): Promise<{|
  ...pkgType,
  author: string,
|}> => {
  const username = gitUserName({ type: 'global', path: undefined });
  const email = gitUserEmail({ type: 'global', path: undefined });
  const pkg: pkgType = {
    ...originialPkg,
    license: 'MIT',
    version: '1.0.0',
    main: './lib/index.js',
    author: `${username} <${email}>`,
  };
  const { isPrivate, ...data } = await inquirer(
    [
      {
        name: 'name',
        default: pkg.name || path.basename(projectDir),
      },
      {
        name: 'isPrivate',
        message: 'private',
        type: 'confirm',
        default: pkg.private || false,
      },
      {
        name: 'description',
      },
      {
        name: 'homepage',
        validate: (val: string) =>
          isURL(val, { require_protocol: true }) ||
          'must be url, for example: https://mikojs.github.io',
      },
      {
        name: 'repository',
        validate: (val: string) =>
          isURL(val, { require_protocol: true }) ||
          /^git@.*:.*\.git$/.test(val) ||
          'must be url or git ssh, for example: https://github.com/mikojs/core.git',
      },
      {
        name: 'keywords',
        message: 'keywords (comma to split)',
        filter: (val: string): $ReadOnlyArray<string> =>
          val.split(/\s*,\s*/g).filter(Boolean),
        validate: (val: $ReadOnlyArray<string>) =>
          val.length !== 0 || 'can not be empty',
        // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
        default: pkg.keywords?.join(','),
      },
    ].map(
      ({
        name,
        message,
        validate,
        default: defaultValue,
        ...question
      }: {|
        name: string,
        type?: string,
        message?: string,
        filter?: (val: string) => $ReadOnlyArray<string>,
        validate?: (val: string & $ReadOnlyArray<string>) => string | boolean,
        default?: string | boolean,
      |}) => ({
        ...question,
        name,
        message: name,
        validate:
          validate || ((val: string) => val !== '' || 'can not be empty'),
        default: defaultValue || pkg[name],
      }),
    ),
  );

  Object.keys(data).forEach((key: 'author') => {
    pkg[key] = data[key];
  });

  if (isPrivate) pkg.private = true;
  else
    pkg.publishConfig = {
      access: 'public',
    };

  return pkg;
};
