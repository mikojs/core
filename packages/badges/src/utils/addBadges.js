// @flow

import fs from 'fs';
import path from 'path';

import execa from 'execa';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import { createLogger } from '@mikojs/utils';

type ctxType = {|
  rootPath: string,
  pkg: {
    [string]: string,
    engines?: {|
      [string]: string,
    |},
  },
|};

type badgeType = {
  [string]: string,
  filterFunc?: boolean => boolean,
};

type repoType = {|
  username: string,
  projectName: string,
|};

const debugLog = debug('badges:addBadges');
const logger = createLogger('@mikojs/badges');
const START_COMMENT = '<!-- badges.start -->';
const END_COMMENT = '<!-- badges.end -->';

/**
 * @return {Promise<repoType>} - user name and project name
 */
const getRepo = async (): Promise<?repoType> => {
  try {
    const { stdout } = await execa('git', ['remote', '-v']);
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
 * @param {ctxType} ctx - context
 * @param {repoType} repo - repo data
 *
 * @return {string} - badges string
 */
const getBadges = (
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

      /**
       * @param {boolean} result - use function or not
       *
       * @return {boolean} - the result of the checking
       */
      filterFunc: (result: boolean) => !result,
    },
    ...Object.keys(engines).map((key: string) => ({
      filePath: './package.json',
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
    {
      filePath: './.git',
      badgeName: 'git-search-todo',
      image: `https://img.shields.io/github/search/${username}/${projectName}/todo+-language:markdown?label=todo`,
      link: `https://github.com/${username}/${projectName}/search?q=todo+-language:markdown&unscoped_q=todo+-language:markdown`,
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

/**
 * @param {string} readme - readme content
 * @param {ctxType} ctx - readme context
 *
 * @return {Promise<string>} - modified readme
 */
export default async (readme: string, ctx: ctxType): Promise<?string> => {
  const repo = await getRepo();

  if (!repo) {
    logger.fail('Can not find git remote');
    return null;
  } else
    return readme.replace(
      new RegExp(`${START_COMMENT}(.|\n)*${END_COMMENT}`, 'g'),
      `${START_COMMENT}${getBadges(ctx, repo)}${END_COMMENT}`,
    );
};
