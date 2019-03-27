// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';

import react, { buildStatic } from '../../index';

import { type configType } from 'utils/buildJs';

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
   * @param {Object} config - react middleware config
   *
   * @return {Object} - react middleware config
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

  app.use(
    await react({
      dev,
      config: configFunc,
      folderPath: path.resolve(__dirname, './custom'),
      basename: '/custom',
      useStatic,
    }),
  );

  app.use(
    await react({
      dev,
      config: configFunc,
      folderPath: path.resolve(__dirname, './page'),
      useStatic,
    }),
  );

  return {
    domain: `http://localhost:${port}`,
    server: await new Promise(resolve => {
      // $FlowFixMe https://github.com/flow-typed/flow-typed/pull/3221
      const server = app.listen(port, async () => {
        const { log } = console;

        await buildStatic(server, {
          port,
          folderPath,
        });
        log(`Run server at port: ${port}`);
        resolve(server);
      });
    }),
  };
};
