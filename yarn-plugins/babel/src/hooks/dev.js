import path from 'path';

import dirCommand from '@babel/cli/lib/babel/dir';

export default ({ cwd, changedWorkspaces }) => {
  changedWorkspaces.forEach(({ relativeCwd }) => {
    dirCommand({
      babelOptions: {
        rootMode: 'upward',
      },
      cliOptions: {
        filenames: [path.resolve(cwd, relativeCwd, './src')],
        outDir: path.resolve(cwd, relativeCwd, './lib'),
      },
    });
  });
};
