// @flow

import { emptyFunction } from 'fbjs';

export type badgeType = {|
  filePath: string,
  name: string,
  image: string,
  link?: string,
  // TODO
  filterFunc?: (result: boolean) => boolean,
|};

export default ([
  {
    filePath: './.circleci/config.yml',
    name: 'circleci',
    image: `https://img.shields.io/circleci/project/github/{{ repoInfo }}/main.svg`,
    link: `https://circleci.com/gh/{{ repoInfo }}`,
  },
  {
    filePath: './.npmignore',
    name: 'npm',
    image: `https://img.shields.io/npm/v/{{ name }}.svg`,
    link: `https://www.npmjs.com/package/{{ name }}`,
  },
  {
    filePath: './.npmignore',
    name: 'npm-size',
    image: `https://img.shields.io/bundlephobia/minzip/{{ name }}.svg`,
  },
  {
    filePath: './.git',
    name: 'github-size',
    image: `https://img.shields.io/github/repo-size/{{ repoInfo }}.svg`,
  },
  ...['node', 'npm', 'yarn'].map((engine: string) => ({
    filePath: './package.json',
    name: `engine-${engine}`,
    image: `https://img.shields.io/badge/${engine}-{{ ${engine} }}-green.svg`,
    filterFunc: emptyFunction.thatReturnsTrue,
  })),
  {
    filePath: './LICENSE',
    name: 'license',
    image: `https://img.shields.io/github/license/{{ repoInfo }}.svg`,
    link: `./LICENSE`,
  },
  {
    filePath: './node_modules/.bin/lerna',
    name: 'lerna',
    image: 'https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg',
    link: 'https://lernajs.io',
  },
  {
    filePath: './.git',
    name: 'git-search-todo',
    image: `https://img.shields.io/github/search/{{ repoInfo }}/todo+-language:markdown?label=todo`,
    link: `https://github.com/{{ repoInfo }}/search?q=todo+-language:markdown&unscoped_q=todo+-language:markdown`,
  },
]: $ReadOnlyArray<badgeType>);
