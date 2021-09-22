const normalize = (config, alias) =>
  (config instanceof Array
    ? config
    : [config]
  ).map(
    configStrOrObj => alias[configStrOrObj] || configStrOrObj
  );

export default ({
  alias = {},
  scripts = {},
}) => Object.keys(scripts)
  .reduce((result, key) => [
    ...result,
    [key, normalize(scripts[key], alias)],
  ], []);
