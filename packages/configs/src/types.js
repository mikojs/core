// @flow

export type configType = {|
  alias?: string,
  install?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  config?: (config: { configsEnv: $ReadOnlyArray<string> }) => mixed,
  ignore?: (ignore: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  ignoreName?: string,
  run?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  env?: {},
  configFiles?: {},
|};
