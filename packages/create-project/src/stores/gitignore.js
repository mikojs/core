// @flow

import Store from './index';

export const template = `# default
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
   * gitignore.end()
   */
  end = () => {
    this.writeFiles({
      '.gitignore': template,
    });
  };
}

export default new Gitignore();
