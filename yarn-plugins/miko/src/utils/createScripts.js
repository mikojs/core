export default scripts => {
  const cache = scripts.map(({ script }) => ({
    script,
  }));

  return {
    toString: () => `run \`${cache.map(({ script }) => script).join(' && ')}\``,
  };
};
