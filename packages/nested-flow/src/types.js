// @flow

export type commandType = {|
  keys: $ReadOnlyArray<$ReadOnlyArray<string>>,
  overwriteArgv?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  success?: (message: string, folder: string) => void,
  fail?: (message: string, folder: string) => void,
  end?: () => number,
|};
