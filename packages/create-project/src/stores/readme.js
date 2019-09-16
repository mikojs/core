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
 * @param {boolean} useServer - use server or not
 *
 * @return {string} - content
 */
const scriptsDescription = (lerna: boolean, useServer: ?boolean) => ({
  ...(useServer
    ? {
        start: 'Run production server.',
      }
    : {
        prod: 'Run production.',
      }),
  dev: 'Run development.',
  test: lerna ? 'Run pre-testing.' : 'Run testing.',
});

/**
 * @example
 * scriptsTemplate(lerna, useNpm, scripts)
 *
 * @param {boolean} lerna - lerna option
 * @param {boolean} useNpm - use npm or not
 * @param {boolean} useServer - use server or not
 * @param {Store.ctx.pkg.scripts} scripts - pkg scripts
 *
 * @return {string} - content
 */
const scriptsTemplate = (
  lerna: boolean,
  useNpm: ?boolean,
  useServer: ?boolean,
  scripts: { [string]: string },
) => `

${useNpm ? '## Develop' : '## Usage'}

${Object.keys(scripts)
  .map(
    (key: string) =>
      `- \`${key}\`: ${scriptsDescription(lerna, useServer)[key]}`,
  )
  .join('\n')}`;

/**
 * @example
 * template(pkg, useNpm)
 *
 * @param {boolean} lerna - lerna option
 * @param {Store.ctx.pkg} pkg - pkg in store context
 * @param {boolean} useNpm - use npm or not
 * @param {boolean} useServer - use server or not
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
  useServer: ?boolean,
) => `# [${name}][website] · <!-- badges.start --><!-- badges.end -->

[website]: ${homepage}

${description}${lerna && !useNpm ? '' : startTemplate(useNpm, name)}${
  !scripts || Object.keys(scripts).length === 0
    ? ''
    : scriptsTemplate(lerna, useNpm, useServer, scripts)
}`;

/** readme store */
class Readme extends Store {
  /**
   * @example
   * readme.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({
    lerna,
    pkg,
    useNpm,
    useServer,
  }: $PropertyType<Store, 'ctx'>) => {
    invariant(pkg, 'Can not run readme store without pkg in `ctx`');

    await this.writeFiles({
      'README.md': template(lerna, pkg, useNpm, useServer),
    });
  };
}

export default new Readme();
