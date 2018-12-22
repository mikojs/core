// @flow

import title from './title';
import scripts from './scripts';

export type ctxType = {
  rootPath: string,
  pkg: {
    [string]: string,
    engines: {
      [string]: string,
    },
    scripts: {
      [string]: string,
    },
  },
  repo: { username: string, projectName: string },
};

export default (key: string, ctx: ctxType): ?string => {
  switch (key) {
    case 'title':
      return title(ctx);

    case 'scripts':
      return scripts(ctx);

    default:
      return null;
  }
};
