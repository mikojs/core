// @flow

import badges from './badges';

export type ctxType = {
  rootPath: string,
  pkg: { name: string },
  repo: { username: string, projectName: string },
};

export default (key: string, ctx: ctxType): ?string => {
  switch (key) {
    case 'badges':
      return badges(ctx);

    default:
      return null;
  }
};
