// @flow

import title from './title';

export type ctxType = {
  rootPath: string,
  pkg: { [string]: string },
  repo: { username: string, projectName: string },
};

export default (key: string, ctx: ctxType): ?string => {
  switch (key) {
    case 'title':
      return title(ctx);

    default:
      return null;
  }
};
