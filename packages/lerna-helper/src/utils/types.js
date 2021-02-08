// @flow

export type packageType = {|
  name: string,
  bin: {|
    [string]: string,
  |},
  rootPath: string,
  location: string,
  dependencies?: {|
    [string]: string,
  |},
  devDependencies?: {|
    [string]: string,
  |},
  peerDependencies?: {|
    [string]: string,
  |},
|};
