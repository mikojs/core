// flow-typed signature: f1a3c869dd3628d882d6855931d9a4ca
// flow-typed version: 19cb5212f8/directory-tree_v2.x.x/flow_>=v0.71.x

// TODO

declare module 'directory-tree' {
  import typeof pathType from 'path';

  declare type directoryNodeType = {|
    path: string,
    name: string,
    size: number,
    type: 'directory' | 'file',
    extension?: string,
    children?: Array<directoryNodeType>,
  |};

  declare type directoryTreeType = (
    path: string,
    options?: {|
      normalizePath?: (path: string) => string,
      exclude?: RegExp | Array<RegExp>,
      extensions?: RegExp,
    |} | null,
    onEachFile?: (
      item: {|
        path: string,
        name: string,
      |},
      PATH: pathType,
    ) => void,
  ) => directoryNodeType;

  declare module.exports: directoryTreeType;
}
