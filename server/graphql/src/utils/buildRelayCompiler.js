// @flow

import path from 'path';

import execa, { type ExecaPromise as ExecaPromiseType } from 'execa';
import { printSchema } from 'graphql';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import debug from 'debug';

import { type cacheType } from './buildSchema';

const debugLog = debug('graphql:buildRelayCompiler');

/**
 * @param {cacheType} cache - schema cache
 *
 * @return {Function} - relay compiler running command
 */
export default (cache: cacheType) => (argv: $ReadOnlyArray<string>) => {
  const schemaFilePath = path.resolve(
    findCacheDir({ name: 'graphql' }),
    './schema.graphql',
  );
  let subprocess: ExecaPromiseType;

  debugLog(schemaFilePath);
  cache.events.on('build', () => {
    const currentSchema = cache.get();

    debugLog(currentSchema);

    if (!currentSchema) return;

    outputFileSync(schemaFilePath, printSchema(currentSchema));

    if (subprocess) subprocess.cancel();

    subprocess = execa(
      'relay-compiler',
      ['--schema', schemaFilePath, ...argv],
      {
        stdio: 'inherit',
        preferLocal: true,
      },
    );
  });
};
