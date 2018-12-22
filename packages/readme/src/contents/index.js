// @flow

import title from './title';
import scripts from './scripts';
import changelog from './changelog';

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
  const contents = {
    title,
    scripts,
    changelog,
  };

  // $FlowFixMe Flow does not yet support method or property calls in optional chains.
  return contents[key]?.(ctx);
};
