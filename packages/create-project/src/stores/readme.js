// @flow

import { invariant } from 'fbjs';

import Store from './index';

/**
 * @example
 * npmContent(false, 'name')
 *
 * @param {boolean} lerna - lerna option
 * @param {string} name - pkg name
 *
 * @return {string} - npm content
 */
const npmContent = (lerna: boolean, name: string) => `## Install

\`\`\`sh
yarn add ${name}
\`\`\`${
  lerna
    ? ''
    : `

## Develop`
}`;

/**
 * @example
 * noNpmContent(false)
 *
 * @param {boolean} lerna - lerna option
 *
 * @return {string} - no npm content
 */
const noNpmContent = (lerna: boolean) => `## Getting Started

\`\`\`sh
yarn install
\`\`\`${
  lerna
    ? ''
    : `

## Usage`
}`;

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
  }: $NonMaybeType<$PropertyType<$PropertyType<Store, 'ctx'>, 'pkg'>>,
  useNpm: ?boolean,
) => `# [${name}][website] · <!-- badges.start --><!-- badges.end -->

[website]: ${homepage}

${description}

${useNpm ? npmContent(lerna, name) : noNpmContent(lerna)}${
  lerna
    ? ''
    : `

- \`dev\`: Run development.
- \`prod\`: Run production.
- \`test\`: Run testing.`
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
