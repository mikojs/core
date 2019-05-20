// @flow

/** mock outputFileSync */
class OutPutFileSync {
  destPaths = [];

  contents = [];

  /**
   * @example
   * outputFileSync.main('test');
   *
   * @param {string} destPath - dest path to add
   * @param {string} content - content to add
   */
  +main = (destPath: string, content: string) => {
    this.destPaths.push(destPath);
    this.contents.push(content);
  };
}

export const outputFileSync = new OutPutFileSync();
export default outputFileSync.main;
