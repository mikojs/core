// @flow

import Store from 'stores';

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

export default (
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
