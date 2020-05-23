// @flow

import path from 'path';

import execa, { type ExecaPromise as ExecaPromiseType } from 'execa';
import { printSchema } from 'graphql';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import debug from 'debug';

import { type schemaType } from './buildSchema';

const debugLog = debug('graphql:buildRelayCompiler');

/**
 * @param {schemaType} schema - schema cache
 *
 * @return {Function} - relay compiler running command
 */
export default (schema: schemaType) => (argv: $ReadOnlyArray<string>) => {
  const schemaFilePath = path.resolve(
    findCacheDir({ name: 'graphql' }),
    './schema.graphql',
  );
  let subprocess: ExecaPromiseType;

  /**
   */
  const run = () => {
    const currentSchema = schema.get();

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
  };

  debugLog(schemaFilePath);
  run();
  schema.events.on('build', run);
};
