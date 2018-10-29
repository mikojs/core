// @flow

/** mock findCacheDir */
class FindCacheDir {
  notFindCacheDir = false;

  cachePath = false;

  /**
   * @example
   * main()
   *
   * @return {Function} - return findCacheDir function
   */
  main = () => (filename: string): ?string => {
    if (this.notFindCacheDir) {
      this.notFindCacheDir = false;
      return null;
    }

    if (this.cachePath) {
      const { cachePath } = this;

      this.cachePath = false;
      return cachePath;
    }

    return filename;
  };
}

export const findCacheDir = new FindCacheDir();
export default findCacheDir.main;
