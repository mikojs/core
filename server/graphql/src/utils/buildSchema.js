// @flow

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

import { type schemaType } from '../index';

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

const debugLog = debug('graphql:buildSchema');

/**
 * @param {schemaType} schema - schema cache
 * @param {string} folderPath - folder path
 * @param {optionsType} options - build schema options
 */
export default (
  schema: schemaType,
  folderPath: string,
  options: optionsType,
) => {
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
  const cache = {
    files: [],
    build: () => {
      if (additionalTypeDefs.length === 0 && cache.files.length === 0) {
        delete schema.cache;
        schema.events.emit('build');
        return;
      }

      schema.cache = makeExecutableSchema(
        [
          {
            filePath: 'additional',
            typeDefs: additionalTypeDefs,
            resolvers: additionalResolvers,
          },
          ...cache.files,
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
      schema.events.emit('build');
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
        cache.files = cache.files.filter(
          ({ filePath: currentFilePath }: schemaFileType) =>
            currentFilePath !== filePath,
        );

        if (event !== 'unlink')
          cache.files = [
            ...cache.files,
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
};
