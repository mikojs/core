// @flow

type nodeType = {| type: string |};

type helmetType = {
  [string]: {
    toComponent: () => nodeType,
  },
};

const KEYS = ['title', 'meta', 'link', 'script'];

/** mock helmet */
class Helmet {
  caches = {};

  /**
   * @example
   * helmet.getDefaultCache();
   */
  getDefaultCache = () => {
    KEYS.forEach((key: string) => {
      this.caches[key] = [];
    });
  };

  /**
   * @example
   * helmet.renderStatic();
   *
   * @return {Object} - helmet object
   */
  renderStatic = (): helmetType => {
    const nowCaches = { ...this.caches };

    this.getDefaultCache();

    return KEYS.reduce(
      (result: helmetType, type: string) => ({
        ...result,
        [type]: {
          toComponent: () => nowCaches[type],
        },
      }),
      {},
    );
  };

  /**
   * @example
   * <helmet.Helmet />
   *
   * @param {Object} props - react props
   *
   * @return {null} - null
   */
  Helmet = ({ children }: { children: $ReadOnlyArray<nodeType> }): null => {
    (children instanceof Array ? children : [children]).forEach(
      (child: nodeType) => {
        const { type } = child;

        this.caches[type].push(child);
      },
    );

    return null;
  };
}

const helmet = new Helmet();

helmet.getDefaultCache();
helmet.Helmet.renderStatic = helmet.renderStatic;

export default helmet;
