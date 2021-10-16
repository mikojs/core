import { structUtils } from '@yarnpkg/core';

export default ({ workspaces }) => {
  workspaces.filter(({ locator }) => {
    const name = structUtils.stringifyIdent(locator);

    return (
      /^(@(?!babel\/)[^/]+\/)([^/]*babel-(preset|plugin)(?:-|\/|$)|[^/]+\/)/.test(
        name,
      ) || /^babel-(preset|plugin)/.test(name)
    );
  });
};
