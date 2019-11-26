// @flow

import debug from 'debug';
import chalk from 'chalk';
import outputFileSync from 'output-file-sync';

import { createLogger } from '@mikojs/utils';

import findFiles, { type filesDataType } from './findFiles';
import configs from './configs';
import sendToServer from './sendToServer';

const logger = createLogger('@mikojs/configs');
const debugLog = debug('configs:generateFiles');

/**
 * @example
 * generateFiles('cli')
 *
 * @param {string} cliName - cli name
 *
 * @return {boolean} - generating file is successful or not
 */
export default async (cliName: string): Promise<boolean> => {
  const files = findFiles(cliName);

  if (!files) {
    const { alias: cli = cliName } = configs.store[cliName];

    logger
      .fail('Can not generate the config file, You can:')
      .fail('')
      .fail(
        chalk`  - Add the path of the config in {cyan \`configs.${cliName}.configsFiles.${
          typeof cli === 'function' ? '<key>' : cli
        }\`}`,
      )
      .fail(chalk`  - Run command with {cyan \`--configs-files\`} options`)
      .fail('');
    return false;
  }

  debugLog(`Config files: ${JSON.stringify(files, null, 2)}`);

  await Promise.all(
    Object.keys(files).map((key: string) =>
      Promise.all(
        files[key].map(
          ({ filePath, content }: $ElementType<filesDataType, number>) =>
            new Promise(resolve => {
              debugLog(`Generate config: ${filePath}`);
              sendToServer(
                JSON.stringify({ pid: process.pid, filePath }),
                () => {
                  outputFileSync(filePath, content);
                  debugLog(
                    `${filePath}(generateFile) has been sent to the server`,
                  );
                  resolve();
                },
              );
            }),
        ),
      ),
    ),
  );

  return true;
};
