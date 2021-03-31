// @flow

import fs from 'fs';
import path from 'path';

export type ctxType = {|
  repoInfo: string,
  rootPath: string,
  name: string,
  homepage: string,
  engines?: {|
    [string]: string,
  |},
|};

export type badgeType = {|
  name: string,
  image: string,
  link?: string,
  skip: (ctx: ctxType) => boolean,
|};

/**
 * @param {string} filePath - file path
 *
 * @return {Function} - skip function
 */
const fileNotExist = (filePath: string) => ({ rootPath }: ctxType) =>
  !fs.existsSync(path.resolve(rootPath, filePath));

export default ([
  {
    name: 'circleci',
    image:
      'https://img.shields.io/circleci/project/github/{{ repoInfo }}/main.svg',
    link: 'https://circleci.com/gh/{{ repoInfo }}',
    skip: fileNotExist('./.circleci/config.yml'),
  },
  {
    name: 'npm',
    image: 'https://img.shields.io/npm/v/{{ name }}.svg',
    link: 'https://www.npmjs.com/package/{{ name }}',
    skip: fileNotExist('./.npmignore'),
  },
  {
    name: 'npm-size',
    image: 'https://img.shields.io/bundlephobia/minzip/{{ name }}.svg',
    skip: fileNotExist('./.npmignore'),
  },
  {
    name: 'github-size',
    image: 'https://img.shields.io/github/repo-size/{{ repoInfo }}.svg',

    /**
     * @param {ctxType} ctx - context value
     *
     * @return {boolean} - should skip badge or not
     */
    skip: ({ rootPath }: ctxType) =>
      fs.existsSync(path.resolve(rootPath, './.npmignore')),
  },
  ...['node', 'npm', 'yarn'].map((engine: string) => ({
    name: `engine-${engine}`,
    image: `https://img.shields.io/badge/${engine}-{{ engines.${engine} }}-green.svg`,

    /**
     * @param {ctxType} ctx - context value
     *
     * @return {boolean} - should skip badge or not
     */
    skip: ({ engines }: ctxType) => !engines?.[engine],
  })),
  {
    name: 'license',
    image: 'https://img.shields.io/github/license/{{ repoInfo }}.svg',
    link: './LICENSE',
    skip: fileNotExist('./LICENSE'),
  },
  {
    name: 'lerna',
    image: 'https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg',
    link: 'https://lernajs.io',
    skip: fileNotExist('./node_modules/.bin/lerna'),
  },
  {
    name: 'git-search-todo',
    image:
      'https://img.shields.io/github/search/{{ repoInfo }}/todo+-language:markdown?label=todo',
    link:
      'https://github.com/{{ repoInfo }}/search?q=todo+-language:markdown&unscoped_q=todo+-language:markdown',
    skip: fileNotExist('./.git'),
  },
]: $ReadOnlyArray<badgeType>);
