// @flow

import Store from './index';

/**
 * @example
 * npmContent('name')
 *
 * @param {string} name - pkg name
 *
 * @return {string} - npm content
 */
const npmContent = (name: string) => `## Install

\`\`\`sh
yarn add ${name}
\`\`\`

## Develop`;

/**
 * @example
 * noNpmContent('name')
 *
 * @return {string} - no npm content
 */
const noNpmContent = () => `## Getting Started

\`\`\`sh
yarn install
\`\`\`

## Usage`;

/**
 * @example
 * template(pkg, useNpm)
 *
 * @param {Object} pkg - pkg in store context
 * @param {boolean} useNpm - useNpm in store context
 *
 * @return {string} - content
 */
const template = (
  {
    name,
    homepage,
    description,
  }: $NonMaybeType<$PropertyType<$PropertyType<Store, 'ctx'>, 'pkg'>>,
  useNpm: ?boolean,
) => `# [${name}][website] · <!-- badges.start --><!-- badges.end -->

[website]: ${homepage}

${description}

${useNpm ? npmContent(name) : noNpmContent()}

- \`dev\`: Run development.
- \`prod\`: Run production.
- \`test\`: Run testing.`;

/** readme store */
class Readme extends Store {
  /**
   * @example
   * readme.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  end = ({ pkg, useNpm }: $PropertyType<Store, 'ctx'>) => {
    if (!pkg) return;

    this.writeFiles({
      'README.md': template(pkg, useNpm),
    });
  };
}

export default new Readme();
