// @flow

export const defaultRelayCompilerOptions = {
  include: ['**'],
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  verbose: false,
  quiet: false,
  watchman: true,
  watch: false,
  validate: false,
  repersist: false,
  noFutureProofEnums: false,
  language: 'javascript',
  eagerESModules: false,
};

export default {
  description: 'create Relay generated files',
  args: '<source-path>',
  options: [
    {
      flags: '--include <include...>',
      description: 'Directories to include under src',
    },
    {
      flags: '--exclude <exclude...>',
      description: 'Directories to ignore under src',
    },
    {
      flags: '--extensions <extensions...>',
      description:
        'File extensions to compile (defaults to extensions provided by the language plugin)',
    },
    { flags: '--verbose', description: 'More verbose logging' },
    { flags: '--quiet', description: 'No output to stdout' },
    { flags: '--watchman', description: 'Use watchman when not in watch mode' },
    {
      flags: '--watch',
      description: 'If specified, watches files and regenerates on changes',
    },
    {
      flags: '--validate',
      description:
        'Looks for pending changes and exits with non-zero code instead of writing to disk',
    },
    {
      flags: '--persistFunction <persistFunction>',
      description:
        'An async function (or path to a module exporting this function) which will persist the query text and return the id.',
    },
    {
      flags: '--persistOutput <persistOutput>',
      description:
        'A path to a .json file where persisted query metadata should be saved. Will use the default implementation (md5 hash) if `persistFunction` is not passed.',
    },
    {
      flags: '--repersist',
      description:
        'Run the persist function even if the query has not changed.',
    },
    {
      flags: '--noFutureProofEnums',
      description:
        'This option controls whether or not a catch-all entry is added to enum type definitions for values that may be added in the future. Enabling this means you will have to update your application whenever the GraphQL server schema adds new enum values to prevent it from breaking.',
    },
    {
      flags: '--language <language>',
      description:
        'The name of the language plugin used for input files and artifacts',
    },
    {
      flags: '--artifactDirectory <artifactDirectory>',
      description:
        'A specific directory to output all artifacts to. When enabling this the babel plugin needs `artifactDirectory` set as well.',
    },
    {
      flags: '--eagerESModules',
      description: 'This option enables emitting es modules artifacts.',
    },
  ],
  requiredOptions: [
    { flags: '--src <src>', description: 'Root directory of application code' },
  ],
};
