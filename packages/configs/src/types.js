// @flow

export type funcConfigType = (config: {}) => {};

export type objConfigType = {|
  alias?: string | ((argv: $ReadOnlyArray<string>) => string),
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
  [string]: configType,
};
