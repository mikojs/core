// @flow

import fs from 'fs';
import path from 'path';

import type { ctxType } from '.';

type badgeType = {
  [string]: string,
};

export default ({
  rootPath,
  pkg: { name },
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
      filePath: './LICENSE',
      badgeName: 'license',
      image: `https://img.shields.io/github/license/${username}/${projectName}.svg`,
      link: `https://github.com/${username}/${projectName}/blob/master/LICENSE`,
    },
    {
      filePath: './node_modules/.bin/lerna',
      badgeName: 'lerna',
      image: 'https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg',
      link: 'https://lernajs.io',
    },
  ].filter(({ filePath }: badgeType) =>
    fs.existsSync(path.resolve(rootPath, filePath)),
  );
  const readmeName = name.replace(new RegExp(`@?${username}/?`), '');

  return `# ${readmeName[0].toUpperCase()}${readmeName.slice(1)} ${badges
    .map(
      ({ badgeName }: badgeType) =>
        `[![${badgeName}][${badgeName}-image]][${badgeName}-link]`,
    )
    .join(' ')}

${badges
    .map(
      ({ badgeName, image, link }: badgeType) =>
        `[${badgeName}-image]: ${image}\n[${badgeName}-link]: ${link}`,
    )
    .join('\n')}`;
};
