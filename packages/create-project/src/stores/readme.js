// @flow

import { invariant } from 'fbjs';

import Store from './index';

/**
 * @example
 * startTemplate(useNpm, name)
 *
 * @param {boolean} useNpm - use npm or not
 * @param {string} name - pkg name
 *
 * @return {string} - content
 */
const startTemplate = (useNpm: ?boolean, name: string) =>
  useNpm
    ? `

## Install

\`\`\`sh
yarn add ${name}
\`\`\``
    : `

## Getting Started

\`\`\`sh
yarn install
\`\`\``;

/**
 * @example
 * scriptsDescription(lerna)
 *
 * @param {boolean} lerna - lerna option
 *
 * @return {string} - content
 */
const scriptsDescription = (lerna: boolean) => ({
  dev: 'Run development.',
  prod: 'Run production.',
  test: lerna ? 'Run pre-testing.' : 'Run testing.',
});

/**
 * @example
 * scriptsTemplate(lerna, useNpm, scripts)
 *
 * @param {boolean} lerna - lerna option
 * @param {boolean} useNpm - use npm or not
 * @param {Object} scripts - pkg scripts
 *
 * @return {string} - content
 */
const scriptsTemplate = (
  lerna: boolean,
  useNpm: ?boolean,
  scripts: { [string]: string },
) => `

${useNpm ? '## Develop' : '## Usage'}

${Object.keys(scripts)
  .map((key: string) => `- \`${key}\`: ${scriptsDescription(lerna)[key]}`)
  .join('\n')}`;

/**
 * @example
 * template(pkg, useNpm)
 *
 * @param {boolean} lerna - lerna option
 * @param {Object} pkg - pkg in store context
 * @param {boolean} useNpm - useNpm in store context
 *
 * @return {string} - content
 */
const template = (
  lerna: boolean,
  {
    name,
    homepage,
    description,
    scripts,
  }: $NonMaybeType<$PropertyType<$PropertyType<Store, 'ctx'>, 'pkg'>>,
  useNpm: ?boolean,
) => `# [${name}][website] · <!-- badges.start --><!-- badges.end -->

[website]: ${homepage}

${description}${lerna && !useNpm ? '' : startTemplate(useNpm, name)}${
  !scripts || Object.keys(scripts).length === 0
    ? ''
    : scriptsTemplate(lerna, useNpm, scripts)
}`;

/** readme store */
class Readme extends Store {
  /**
   * @example
   * readme.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna, pkg, useNpm }: $PropertyType<Store, 'ctx'>) => {
    invariant(pkg, 'Can not run readme store without pkg in `ctx`');

    await this.writeFiles({
      'README.md': template(lerna, pkg, useNpm),
    });
  };
}

export default new Readme();
