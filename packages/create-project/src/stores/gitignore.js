// @flow

import Store from './index';

const template = `# default
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
coverage`;

/** gitignore store */
class Gitignore extends Store {
  /**
   * @example
   * gitignore.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      '.gitignore': template,
    });
  };
}

export default new Gitignore();
