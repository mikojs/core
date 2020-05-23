// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import { emptyFunction } from 'fbjs';
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

type schemaFileType = {|
  filePath: string,
  resolvers: $PropertyType<makeExecutableSchemaOptionsType, 'resolvers'>,
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
|};

type schemaType = {|
  schemas: $ReadOnlyArray<schemaFileType>,
  get: () => ?GraphQLSchemaType,
  build: () => void,
  cache?: GraphQLSchemaType,
|};

const debugLog = debug('graphql:buildSchema');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - build schema options
 *
 * @return {schemaType} - schema cache
 */
export default (folderPath: string, options: optionsType): schemaType => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    makeExecutableSchemaOptions: {
      typeDefs: additionalTypeDefs = [],
      resolvers: additionalResolvers = {},
      resolverValidationOptions,
      ...makeExecutableSchemaOptions
    } = {},
    ...mergeDirOptions
  } = options;
  const cache: schemaType = {
    schemas: [],
    get: () => cache.cache,
    build: () => {
      if (additionalTypeDefs.length === 0 && cache.schemas.length === 0) {
        delete cache.cache;
        return;
      }

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
            { typeDefs, resolvers }: schemaFileType,
          ) => ({
            ...result,
            typeDefs: [
              ...result.typeDefs,
              ...(typeDefs instanceof Array ? typeDefs : [typeDefs]),
            ],
            resolvers: Object.keys(resolvers).reduce(
              (
                prevResolvers: $PropertyType<schemaFileType, 'resolvers'>,
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
      ...mergeDirOptions,
      watch: dev,
      extensions: /\.js$/,
    },
    (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      const { typeDefs, ...resolvers } = requireModule<{|
        [string]: $PropertyType<schemaFileType, 'resolvers'>,
        typeDefs: $PropertyType<schemaFileType, 'typeDefs'>,
      |}>(filePath);

      debugLog({ typeDefs, resolvers });
      logger('start', event, filePath);

      if (['init', 'add', 'change', 'unlink'].includes(event)) {
        cache.schemas = cache.schemas.filter(
          ({ filePath: currentFilePath }: schemaFileType) =>
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

      debugLog(cache);
      logger('end', event, filePath);
    },
  );
  cache.build();

  return cache;
};
