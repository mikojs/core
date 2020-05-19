// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import chalk from 'chalk';
import debug from 'debug';

import { requireModule, mergeDir } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType as serverOptionsType } from '@mikojs/server';

export type optionsType = {|
  ...serverOptionsType,
  makeExecutableSchemaOptions?: $Diff<
    makeExecutableSchemaOptionsType,
    {|
      resolvers: mixed,
      typeDefs: mixed,
    |},
  >,
|};

type schemaType = {|
  filePath: string,
  resolvers: $PropertyType<makeExecutableSchemaOptionsType, 'resolvers'>,
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
|};

type cacheType = {|
  schemas: $ReadOnlyArray<schemaType>,
  build: () => void,
  cache?: GraphQLSchemaType,
|};

const debugLog = debug('graphql:buildSchema');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - build schema options
 *
 * @return {cacheType} - schema cache
 */
export default (
  folderPath: string,
  {
    dev,
    logger,
    makeExecutableSchemaOptions: {
      typeDefs: additionalTypeDefs = [],
      resolvers: additionalResolvers = {},
      resolverValidationOptions,
      ...makeExecutableSchemaOptions
    } = {},
    ...options
  }: optionsType,
): cacheType => {
  const cache: cacheType = {
    schemas: [],
    build: () => {
      cache.cache = makeExecutableSchema(
        [
          {
            filePath: 'additional',
            typeDefs: additionalTypeDefs,
            resolvers: additionalResolvers,
          },
          ...cache.schemas,
        ].reduce(
          (
            result: makeExecutableSchemaOptionsType,
            { typeDefs, resolvers }: schemaType,
          ) => ({
            ...result,
            typeDefs: [
              ...result.typeDefs,
              ...(typeDefs instanceof Array ? typeDefs : [typeDefs]),
            ],
            resolvers: Object.keys(resolvers).reduce(
              (
                prevResolvers: $PropertyType<schemaType, 'resolvers'>,
                key: string,
              ) => ({
                ...prevResolvers,
                [key]: {
                  ...prevResolvers[key],
                  ...resolvers[key],
                },
              }),
              result.resolvers,
            ),
          }),
          {
            ...makeExecutableSchemaOptions,
            resolverValidationOptions: {
              ...resolverValidationOptions,
              requireResolversForResolveType: false,
            },
            typeDefs: [],
            resolvers: {},
          },
        ),
      );
    },
  };

  debugLog(cache);
  mergeDir(
    folderPath,
    {
      ...options,
      watch: dev,
      extensions: /\.js$/,
    },
    (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      const shouldLog = ['add', 'change', 'unlink'].includes(event);
      const outputName = name.replace(extension, '');
      const { typeDefs, ...resolvers } = requireModule<{|
        [string]: $PropertyType<schemaType, 'resolvers'>,
        typeDefs: $PropertyType<schemaType, 'typeDefs'>,
      |}>(filePath);

      debugLog({ typeDefs, resolvers });

      if (shouldLog && logger)
        logger.start(chalk`{gray [${event}]} Server updating (${outputName})`);

      if (['init', 'add', 'change', 'unlink'].includes(event)) {
        cache.schemas = cache.schemas.filter(
          ({ filePath: currentFilePath }: schemaType) =>
            currentFilePath !== filePath,
        );

        if (event !== 'unlink')
          cache.schemas = [
            ...cache.schemas,
            {
              filePath,
              typeDefs,
              resolvers,
            },
          ];

        if (event !== 'init') cache.build();
      }

      if (shouldLog && logger)
        logger.succeed(chalk`{gray [${event}]} Server updated (${outputName})`);

      debugLog(cache);
    },
  );
  cache.build();

  return cache;
};
