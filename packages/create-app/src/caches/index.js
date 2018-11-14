// @flow

/** Cache */
export default class Cache<StoreType> {
  store: StoreType;

  init: (projectDir: string) => Promise<void>;

  isInit = false;

  /**
   * @example
   * cache.get('project/dir');
   *
   * @param {string} projectDir - project dir path
   */
  get = async (projectDir: string): Promise<StoreType> => {
    if (!this.isInit) {
      await this.init(projectDir);

      this.isInit = true;
    }

    return this.store;
  };
}
