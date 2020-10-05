// @flow

import path from 'path';

import watchman from 'fb-watchman';

export type dataType = {|
  exists: boolean,
  filePath: string,
|};

export type callbackType = (data: $ReadOnlyArray<dataType>) => void;

type respType = {|
  warning?: string,
  watch?: mixed,
  relative_path?: mixed,
  files: $ReadOnlyArray<{| exists: boolean, name: string |}>,
|};
type resolveType = (resp: respType) => void;
type rejectType = (err: Error) => void;
type handlerType = (
  resolve: resolveType,
  reject: rejectType,
) => (err: Error, resp: respType) => void;

/**
 * @param {resolveType} resolve - promise resolve function
 * @param {rejectType} reject - promise reject function
 *
 * @return {Function} - handler function for watchman client
 */
export const handler: handlerType = (
  resolve: resolveType,
  reject: rejectType,
) => (err: Error, resp: respType) => {
  const { warn } = console;

  if (resp?.warning) warn(resp.warning);

  if (err) reject(err);
  else resolve(resp);
};

/**
 * @param {string} folderPath - folder path
 * @param {callbackType} callback - handle files function
 *
 * @return {Function} - close client
 */
export default async (
  folderPath: string,
  callback: callbackType,
): Promise<() => void> => {
  const client = new watchman.Client();

  /**
   * @param {string} type - client command type
   * @param {any} options - client command options
   *
   * @return {Promise} - promise client
   */
  const promiseClient = (type: string, options: mixed) =>
    new Promise((resolve, reject) => {
      client[type](options, handler(resolve, reject));
    });

  await promiseClient('capabilityCheck', {
    optional: [],
    required: ['relative_root'],
  });

  const { watch, relative_path: relativePath } = await promiseClient(
    'command',
    ['watch-project', folderPath],
  );
  const { files } = await promiseClient('command', [
    'query',
    watch,
    {
      expression: ['allof', ['match', '*.js']],
      fields: ['exists', 'name'],
      relative_root: relativePath,
    },
  ]);

  callback(
    files.map(
      ({
        exists,
        name,
      }: $ElementType<
        $NonMaybeType<$PropertyType<respType, 'files'>>,
        number,
      >) => ({
        exists,
        filePath: path.resolve(folderPath, name),
      }),
    ),
  );

  return () => client.end();
};
