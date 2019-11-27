// @flow

export type commandType = {|
  overwriteArgv?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  options?: {},
  success?: (message: string, folder: string) => void,
  fail?: (message: string, folder: string) => void,
  end?: () => number,
|};
