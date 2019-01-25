// @flow

import chokidar from 'chokidar';

export default (folderPath: string) => {
  chokidar
    .watch(folderPath, {
      ignoreInitial: true,
    })
    .on('change', (filePath: string) => {
      if (/\.jsx?/.test(filePath)) delete require.cache[filePath];
    });
};
