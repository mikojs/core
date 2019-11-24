// @flow

import fs from 'fs';
import path from 'path';

import memoizeOne from 'memoize-one';
import { isURL } from 'validator';
import { emptyFunction } from 'fbjs';

import { requireModule } from '@mikojs/utils';

import Store from './index';

import getEngines from 'utils/getEngines';
import getUser from 'utils/getUser';

/**
 * @example
 * getPkgQuestions('/project-dir')
 *
 * @param {string} projectDir - the project dir
 *
 * @return {Array} - the pkg questions
 */
export const getPkgQuestions = (
  projectDir: string,
  {
    name,
    private: isPrivate,
    description,
    homepage,
    repository,
    keywords,
  }: $NonMaybeType<$PropertyType<$PropertyType<Store, 'ctx'>, 'pkg'>>,
) => [
  {
    name: 'name',
    default: name || path.basename(projectDir),
  },
  {
    name: 'private',
    message: 'is private or not',
    type: 'confirm',
    default: isPrivate || false,
  },
  {
    name: 'description',
    default: description,
  },
  {
    name: 'homepage',
    validate: (val: string) =>
      isURL(val, { require_protocol: true }) ||
      'must be url, for example: https://mikojs.github.io',
    default: homepage,
  },
  {
    name: 'repository',
    validate: (val: string) =>
      isURL(val, { require_protocol: true }) ||
      /^git@.*:.*\.git$/.test(val) ||
      'must be url or git ssh, for example: https://github.com/mikojs/core.git',
    default: repository,
  },
  {
    name: 'keywords',
    message: 'keywords (comma to split)',
    filter: (val: string): $ReadOnlyArray<string> =>
      val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
    validate: (val: $ReadOnlyArray<string>) =>
      val.length !== 0 || 'can not be empty',
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    default: keywords?.join(','),
  },
];

/** store pkg */
class Pkg extends Store {
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
      const pkgPath = path.resolve(projectDir, './package.json');

      const [username, email] = await getUser();
      const questionResult = await this.prompt<$ReadOnlyArray<string>>(
        ...getPkgQuestions(
          projectDir,
          fs.existsSync(pkgPath) ? requireModule(pkgPath) : {},
        ),
      );

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
        'name',
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
   * @param {Store.ctx} ctx - store context
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
        start: lerna
          ? 'NODE_ENV=production configs server:lerna'
          : 'NODE_ENV=production configs server',
      }: { [string]: string });

      if (useReact && useGraphql) {
        if (lerna)
          this.storePkg.scripts.test = 'SKIP_SERVER=true configs server:lerna';
        else
          this.storePkg.scripts.test =
            'SKIP_SERVER=true configs server && configs test';
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
   * @param {Store.ctx} ctx - store context
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
