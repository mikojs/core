// @flow

export type packageType = {|
  rootPath: string,
  name: string,
  manifestLocation: string,
  dependencies: {|
    [string]: string,
  |},
  devDependencies: {|
    [string]: string,
  |},
  peerDependencies: {|
    [string]: string,
  |},
|};
