// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import { type configType } from 'koa-webpack';

import React from '../../index';

export default async (
  dev: boolean,
  useStatic: boolean,
): Promise<{|
  domain: string,
  server: http$Server,
|}> => {
  const app = new Koa();
  const port = parseInt(process.env.NODE_PORT || (await getPort()), 10);
  const folderPath = path.resolve(
    __dirname,
    '../../../node_modules/test-static',
  );

  /**
   * @example
   * configFunc()
   *
   * @param {Object} config - koa react config
   *
   * @return {Object} - koa react configr
   */
  const configFunc = ({ config, ...otherConfigs }: configType): configType => {
    if (!dev || useStatic)
      config.output = {
        ...config.output,
        path: path.resolve(folderPath, './public/js'),
      };

    return {
      ...otherConfigs,
      config,
    };
  };

  const customReact = new React(path.resolve(__dirname, './custom'), {
    dev,
    config: configFunc,
    basename: '/custom',
  });
  const pageReact = new React(path.resolve(__dirname, './page'), {
    dev,
    config: configFunc,
  });

  if (!dev) {
    await customReact.buildJs();
    await pageReact.buildJs();
  }

  app.use(await customReact.middleware());
  app.use(await pageReact.middleware());

  return {
    domain: `http://localhost:${port}`,
    server: await new Promise(resolve => {
      const server = app.listen(port, async () => {
        const { log } = console;

        if (!dev && useStatic) {
          await customReact.buildStatic({
            baseUrl: `http://localhost:${port}`,
            folderPath,
          });
          await pageReact.buildStatic({
            baseUrl: `http://localhost:${port}`,
            folderPath,
          });
        }

        log(`Run server at port: ${port}`);
        resolve(server);
      });
    }),
  };
};
