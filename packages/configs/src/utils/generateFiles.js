// @flow

import debug from 'debug';
import outputFileSync from 'output-file-sync';

import findFiles, { type filesDataType } from './findFiles';
import sendToServer from './sendToServer';

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

  if (!files) return false;

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
