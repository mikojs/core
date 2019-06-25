// @flow

import path from 'path';

import memoizeOne from 'memoize-one';
import { isURL } from 'validator';
import { emptyFunction } from 'fbjs';

import license from './license';
import readme from './readme';
import Store from './index';

import getEngines from 'utils/getEngines';
import getUser from 'utils/getUser';

export const PKG_QUESTIONS = [
  {
    name: 'private',
    message: 'is private or not',
    type: 'confirm',
    default: false,
  },
  {
    name: 'description',
  },
  {
    name: 'homepage',
    validate: (val: string) =>
      isURL(val, { require_protocol: true }) ||
      'must be url, for example: https://cat.org',
  },
  {
    name: 'repository',
    validate: (val: string) =>
      isURL(val, { require_protocol: true }) ||
      /^git@.*:.*\.git$/.test(val) ||
      'must be url or git ssh, for example: https://github.com/cat-org/core.git',
  },
  {
    name: 'keywords',
    message: 'keywords (comma to split)',
    filter: (val: string): $ReadOnlyArray<string> =>
      val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
    validate: (val: $ReadOnlyArray<string>) =>
      val.length !== 0 || 'can not be empty',
  },
];

/** store pkg */
class Pkg extends Store {
  +subStores = [license, readme];

  +storePkg: $NonMaybeType<
    $PropertyType<$PropertyType<Store, 'ctx'>, 'pkg'>,
  > = {
    license: 'MIT',
    version: '1.0.0',
    main: './lib/index.js',
  };

  /**
   * @example
   * pkg.defaultInfo('/path')
   *
   * @param {string} projectDir - project dir
   */
  +defaultInfo = memoizeOne(
    async ({ projectDir, lerna }: $PropertyType<Store, 'ctx'>) => {
      const [username, email] = await getUser();
      const questionResult = await this.prompt<$ReadOnlyArray<string>>(
        ...PKG_QUESTIONS,
      );

      this.storePkg.name = path.basename(projectDir);
      this.storePkg.author = `${username} <${email}>`;

      if (!lerna) {
        this.storePkg.engines = await getEngines();
        this.storePkg.husky = {
          hooks: {
            'pre-commit': 'configs lint-staged && yarn flow',
          },
        };
      }

      ([
        'private',
        'description',
        'homepage',
        'repository',
        'keywords',
      ]: $ReadOnlyArray<$Keys<typeof questionResult>>).forEach(
        (key: string) => {
          switch (key) {
            case 'private':
              if (questionResult.private) this.storePkg.private = true;
              else if (lerna)
                this.storePkg.publishConfig = {
                  access: 'public',
                };
              break;

            default:
              this.storePkg[key] = questionResult[key];
              break;
          }
        },
      );

      this.debug(this.storePkg);
    },
    emptyFunction.thatReturnsTrue,
  );

  /**
   * @example
   * pkg.addScripts(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +addScripts = ({
    lerna,
    useServer,
    useReact,
    useGraphql,
  }: $PropertyType<Store, 'ctx'>) => {
    if (lerna && !useServer) return;

    if (!this.storePkg.scripts) this.storePkg.scripts = {};

    if (useServer) {
      this.storePkg.scripts = ({
        dev: lerna ? 'configs server:lerna -w' : 'configs server -w',
        prod: lerna
          ? 'NODE_ENV=production configs server:lerna'
          : 'NODE_ENV=production configs server',
      }: { [string]: string });

      if (useReact && useGraphql) {
        if (lerna)
          this.storePkg.scripts.test = 'configs server:lerna --skip-server';
        else
          this.storePkg.scripts.test =
            'configs server --skip-server && configs test';
      } else if (!lerna) this.storePkg.scripts.test = 'configs test';
    } else
      this.storePkg.scripts = {
        dev: 'configs babel -w',
        prod: 'NODE_ENV=production configs babel',
        test: 'configs test',
      };
  };

  /**
   * @example
   * pkg.start(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.defaultInfo(ctx);
    this.addScripts(ctx);

    // TODO: https://github.com/eslint/eslint/issues/11899
    // eslint-disable-next-line require-atomic-updates
    ctx.pkg = this.storePkg;
  };

  /**
   * @example
   * pkg.end(ctx)
   */
  +end = async () => {
    await this.writeFiles({
      'package.json': JSON.stringify(this.storePkg, null, 2),
    });
  };
}

export default new Pkg();
