// @flow

import chalk from 'chalk';

import { typeof createLogger as createLoggerType } from '@mikojs/utils';

import configs from 'utils/configs';

type infoType = {|
  alias?: string,
  install?: $ReadOnlyArray<string>,
  config?: {},
  ignore?: {|
    name?: string,
    ignore?: $ReadOnlyArray<string>,
  |},
  run?: $ReadOnlyArray<string>,
  env?: {},
  configsFiles?: {},
|};

/**
 * @example
 * printInfo(logger, 'cliName')
 *
 * @param {createLoggerType} logger - logger functions
 * @param {string} cliName - cli name
 *
 * @return {boolean} - test result
 */
export default (
  logger: $Call<createLoggerType, string>,
  cliName: ?string,
): boolean => {
  const { info } = console;

  if (cliName) {
    const config = configs.get(cliName);

    if (!config) {
      logger
        .fail(chalk`Can not find {cyan \`${cliName}\`} in configs`)
        .fail(chalk`Use {green \`info\`} to get the more information`);
      return false;
    }

    logger.info(
      chalk`Here is thie information of the {cyan ${cliName}} config:`,
    );
    info();
    info(
      JSON.stringify(
        (Object.keys(config): $ReadOnlyArray<string>).reduce(
          (result: infoType, key: string): infoType => {
            switch (key) {
              case 'install':
                return {
                  ...result,
                  install: config.install?.([]),
                };

              case 'run':
                return {
                  ...result,
                  run: config.run?.([]),
                };

              case 'config':
                return {
                  ...result,
                  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
                  config: config.config?.({}),
                };

              case 'ignore':
                return {
                  ...result,
                  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
                  ignore: config.ignore?.(),
                };

              default:
                return {
                  ...result,
                  [key]: config[key],
                };
            }
          },
          // $FlowFixMe TODO: https://github.com/facebook/flow/issues/2977
          ({}: infoType),
        ),
        null,
        2,
      )
        .split(/\n/)
        .map((text: string) => `  ${text}`)
        .join('\n'),
    );
    info();
  } else {
    logger.info('Here are the all config names which you can use:');
    info();
    configs.all().forEach((key: string) => {
      info(`  - ${key}`);
    });
    info();
  }

  return true;
};
