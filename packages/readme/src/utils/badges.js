// @flow

import fs from 'fs';
import path from 'path';

import execa from 'execa';
import debug from 'debug';
import memoizeOne from 'memoize-one';
import { areEqual, emptyFunction } from 'fbjs';

import logger from './logger';

import type { fileType, ctxType } from './parser';

type badgeType = {
  [string]: string,
  filterFunc?: boolean => boolean,
};

type repoType = {
  username: string,
  projectName: string,
};

const debugLog = debug('readme:badges');
const START_COMMENT = '<!-- readme.badges.start -->';
const END_COMMENT = '<!-- readme.badges.end -->';

/**
 * @example
 * getRepo()
 *
 * @return {Object} - user name and project name
 */
export const getRepo = (): ?repoType => {
  try {
    const { stdout } = execa.shellSync('git remote -v');
    const [username, projectName] = stdout
      .replace(/origin\t.*@.*:(.*).git \(fetch\)(.|\n)*/, '$1')
      .split('/');

    debugLog({
      username,
      projectName,
    });

    return {
      username,
      projectName,
    };
  } catch (e) {
    debugLog(e);
    return null;
  }
};

/**
 * @example
 * getBadges(ctx, repo)
 *
 * @param {Object} ctx - context
 * @param {Object} repo - repo data
 *
 * @return {string} - badges string
 */
export const getBadges = (
  { rootPath, pkg: { name, homepage, engines = {} } }: ctxType,
  { username, projectName }: repoType,
): string => {
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

  return `${badges
    .map(({ badgeName, link }: badgeType) =>
      !link
        ? `![${badgeName}][${badgeName}-image]`
        : `[![${badgeName}][${badgeName}-image]][${badgeName}-link]`,
    )
    .join(' ')}

${badges
    .map(
      ({ badgeName, image, link }: badgeType) =>
        `[${badgeName}-image]: ${image}${
          !link ? '' : `\n[${badgeName}-link]: ${link}`
        }`,
    )
    .join('\n')}
`;
};

const memoizedGetRepo = memoizeOne(getRepo);
const memoizedGetBadges = memoizeOne(getBadges, areEqual);

export default (file: fileType, ctx: ctxType) => {
  const repo = memoizedGetRepo();

  if (!repo) logger.fail('Can not find git remote');
  else
    file.contents = file.contents.replace(
      new RegExp(`${START_COMMENT}(.|\n)*${END_COMMENT}`),
      `${START_COMMENT}${memoizedGetBadges(ctx, repo)}${END_COMMENT}`,
    );
};
