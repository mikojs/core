// @flow

export type funcConfigType = (config: {
  configsEnv: $ReadOnlyArray<string>,
}) => {};

export type objConfigType = {|
  alias?: string,
  getCli?: (argv: $ReadOnlyArray<string>) => string,
  install?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  config?: funcConfigType,
  ignore?: (ignore?: {|
    name?: string,
    ignore?: $ReadOnlyArray<string>,
  |}) => {|
    name?: string,
    ignore?: $ReadOnlyArray<string>,
  |},
  run?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  env?: {},
  configsFiles?: {},
|};

export type configType = funcConfigType | objConfigType;

export type configsType = {
  configsEnv?: $ReadOnlyArray<string>,
  [string]: configType,
};
