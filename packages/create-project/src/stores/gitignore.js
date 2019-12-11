// @flow

import Store from './index';

/**
 * @example
 * template(false)
 *
 * @param {boolean} useRelay - use relay or not
 *
 * @return {string} - content
 */
const template = (useRelay: boolean) => `# default
*.swp
*.log
.DS_Store

# node
node_modules

# babel
lib

# eslint
.eslintcache

# flow
flow-typed/npm

# jest
coverage${
  !useRelay
    ? ''
    : `

# relay
__generated__`
}`;

/** gitignore store */
class Gitignore extends Store {
  /**
   * @example
   * gitignore.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({
    useReact,
    useGraphql,
    lerna,
  }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      '.gitignore': template(Boolean(useReact && useGraphql)),
    });
  };
}

export default new Gitignore();
