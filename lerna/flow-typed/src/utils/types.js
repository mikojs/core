// @flow

export type packageType = {|
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
