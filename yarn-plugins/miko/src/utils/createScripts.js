export default scripts => {
  const cache = scripts.map(({ script, include, exclude }) => ({
    script,
    include,
    exclude,
  }));

  return {
    toString: () => `run \`${cache.map(({ script }) => script).join(' && ')}\``,
    execute: ({ cli, workspaces }) => {},
  };
};
