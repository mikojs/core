// @flow

export type funcConfigType = <C: {}>(config: {
  ...C,
  configsEnv: $ReadOnlyArray<string>,
}) => C;

export type objConfigType = {|
  alias?: string,
  install?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  config?: funcConfigType,
  ignore?: (ignore: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  ignoreName?: string,
  run?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  env?: {},
  configFiles?: {},
|};

export type configType = funcConfigType | objConfigType;

export type configsType = {
  configsEnv?: $ReadOnlyArray<string>,
  [string]: configType,
};
