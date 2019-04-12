// @flow

import path from 'path';

import memoizeOne from 'memoize-one';
import { isURL } from 'validator';
import { emptyFunction } from 'fbjs';

import { version } from '../../package.json';

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
  subStores = [license, readme];

  storePkg: $NonMaybeType<$PropertyType<$PropertyType<Store, 'ctx'>, 'pkg'>> = {
    license: 'MIT',
    version: '1.0.0',
    main: './lib/index.js',
    husky: {
      hooks: {
        'pre-commit': 'configs lint-staged && yarn flow',
      },
    },
    scripts: {},
  };

  /**
   * @example
   * pkg.defaultInfo('/path')
   *
   * @param {string} projectDir - project dir
   */
  defaultInfo = memoizeOne(async (projectDir: string) => {
    const [username, email] = await getUser();
    const questionResult = await this.prompt<$ReadOnlyArray<string>>(
      ...PKG_QUESTIONS,
    );

    this.storePkg.name = path.basename(projectDir);
    this.storePkg.engines = await getEngines();
    this.storePkg.author = `${username} <${email}>`;
    this.storePkg['create-project'] = version;

    Object.keys(questionResult).forEach((key: string) => {
      if (key === 'private' && this.storePkg.private)
        this.storePkg.private = true;
      else this.storePkg[key] = questionResult[key];
    });

    this.debug(this.storePkg);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * pkg.addScripts(true)
   *
   * @param {boolean} useServer - use server or not
   */
  addScripts = ({ useServer, useReact }: $PropertyType<Store, 'ctx'>) => {
    if (useServer) {
      if (useReact)
        this.storePkg.scripts = {
          dev: 'server --dev',
          prod: 'NODE_ENV=production server',
          test: 'configs test:react',
        };
      else
        this.storePkg.scripts = {
          dev: 'server --dev',
          prod: 'NODE_ENV=production server',
          test: 'configs test',
        };
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
   * @param {Object} ctx - store context
   */
  start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { projectDir } = ctx;

    await this.defaultInfo(projectDir);
    this.addScripts(ctx);

    ctx.pkg = this.storePkg;
  };

  /**
   * @example
   * pkg.end(ctx)
   */
  end = async () => {
    await this.writeFiles({
      'package.json': JSON.stringify(this.storePkg, null, 2),
    });
  };
}

export default new Pkg();
