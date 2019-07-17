// @flow

/**
 * @example
 * findOptionsPath('./src/filename.js', './lib/filename.js')
 *
 * shoudl return { src: './src/', dir: './lib' };
 *
 * @param {string} srcPath - source file path
 * @param {string} dirPath - target file path
 *
 * @return {object} - src: source folder path, dir: target folder path
 */
export default (
  srcPath: string,
  dirPath: string,
): {|
  src: string,
  dir: string,
|} => {
  const srcArray = srcPath.split(/\//).reverse();
  const dirArray = dirPath.split(/\//).reverse();
  let isEqual: boolean = true;

  const sameSubstring = srcArray
    .filter((filePath: string, index: number): boolean => {
      if (!isEqual) return false;

      isEqual = filePath === dirArray[index];
      return isEqual;
    })
    .reverse()
    .join('/');

  return {
    src: srcPath.replace(sameSubstring, ''),
    dir: dirPath.replace(sameSubstring, ''),
  };
};
