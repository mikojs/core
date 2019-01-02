// @flow

import fs from 'fs';
import path from 'path';

import Koa from 'koa';
import morgan from 'koa-morgan';
import helmet from 'koa-helmet';
import etag from 'koa-etag';
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import Router from 'koa-router';

const DEV = process.env.NODE_ENV !== 'production';

/** Server */
export default class Server {
  app = new Koa();

  routers = [];

  /**
   * @example
   * new Server()
   *
   * @param {Object} configs - server configs
   */
  constructor(
    configs: ?{
      [string]: boolean | mixed,
    },
  ) {
    ['morgan', 'helmet', 'etag', 'bodyparser', 'compress'].forEach(
      (configName: string) => {
        const config = (configs || {})[configName];

        if (config === false) return;

        if (configName === 'morgan') {
          this.app.use(
            morgan(
              ...(config ||
                (DEV
                  ? ['dev']
                  : [
                      'combined',
                      {
                        stream: fs.createWriteStream(
                          path.resolve('server.log'),
                          {
                            flags: 'a',
                          },
                        ),
                      },
                    ])),
            ),
          );
          return;
        }

        this.app.use(
          {
            helmet,
            etag,
            bodyparser,
            compress,
          }[configName](config),
        );
      },
    );
  }

  /**
   * @example
   * server.router()
   *
   * @param {Object} options - koa-router options
   *
   * @return {Object} - koa-router
   */
  router = (options: ?{}): Router => {
    const router = new Router(options);

    this.routers.push(router);
    return router;
  };

  /**
   * @example
   * server.run(80)
   *
   * @param {number} port - server port
   *
   * @return {Object} - koa server
   */
  run = (port: number = 8000): Koa => {
    this.routers.forEach((router: Router) => {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods());
    });

    return this.app.listen(port);
  };
}
