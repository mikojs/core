// @flow

import fs from 'fs';
import path from 'path';

import { emptyFunction } from 'fbjs';

import type { ctxType } from './index';

type badgeType = {
  [string]: string,
  filterFunc?: boolean => boolean,
};

export default ({
  rootPath,
  pkg: { name, homepage, engines = {} },
  repo: { username, projectName },
}: ctxType): string => {
  const badges = [
    {
      filePath: './.circleci/config.yml',
      badgeName: 'circleci',
      image: `https://img.shields.io/circleci/project/github/${username}/${projectName}/master.svg`,
      link: `https://circleci.com/gh/${username}/${projectName}`,
    },
    {
      filePath: './.npmignore',
      badgeName: 'npm',
      image: `https://img.shields.io/npm/v/${name}.svg`,
      link: `https://www.npmjs.com/package/${name}`,
    },
    {
      filePath: './.npmignore',
      badgeName: 'npm-size',
      image: `https://img.shields.io/bundlephobia/minzip/${name}.svg`,
    },
    {
      filePath: './.npmignore',
      badgeName: 'github-size',
      image: `https://img.shields.io/github/repo-size/${username}/${projectName}.svg`,
      filterFunc: (result: boolean) => !result,
    },
    ...Object.keys(engines).map((key: string) => ({
      filePath: './README.md',
      badgeName: `engine-${key}`,
      image: `https://img.shields.io/badge/${key}-${encodeURI(
        engines[key],
      )}-green.svg`,
      filterFunc: emptyFunction.thatReturnsTrue,
    })),
    {
      filePath: './LICENSE',
      badgeName: 'license',
      image: `https://img.shields.io/github/license/${username}/${projectName}.svg`,
      link: `./LICENSE`,
    },
    {
      filePath: './node_modules/.bin/lerna',
      badgeName: 'lerna',
      image: 'https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg',
      link: 'https://lernajs.io',
    },
  ].filter(
    ({ filePath, filterFunc = emptyFunction.thatReturnsArgument }: badgeType) =>
      filterFunc(fs.existsSync(path.resolve(rootPath, filePath))),
  );
  const readmeName = name.replace(new RegExp(`@?${username}/?`), '');

  return `# [${readmeName[0].toUpperCase()}${readmeName.slice(1)}][homepage]${
    badges.length === 0 ? '' : ' · '
  }${badges
    .map(({ badgeName, link }: badgeType) =>
      !link
        ? `![${badgeName}][${badgeName}-image]`
        : `[![${badgeName}][${badgeName}-image]][${badgeName}-link]`,
    )
    .join(' ')}

[homepage]: ${homepage}
${badges
    .map(
      ({ badgeName, image, link }: badgeType) =>
        `[${badgeName}-image]: ${image}${
          !link ? '' : `\n[${badgeName}-link]: ${link}`
        }`,
    )
    .join('\n')}`;
};
