import chokidar from 'chokidar';

import utils from './utils';
import writeFiles from './writeFiles';

class FlowFiles {
  store = [];

  watcher = null;

  add = file => {
    this.store.push(file);

    if (utils.options.watch) this.openWatcher();
  };

  openWatcher = () => {
    this.watcher?.close();
    this.watcher = chokidar.watch(this.store.map(({ filePath }) => filePath), {
      ignoreInitial: true,
    });

    ['add', 'change'].forEach(type => {
      this.watcher.on(type, modifyFilePath => {
        writeFiles.add(
          this.store.find(({ filePath }) => modifyFilePath === filePath),
        );
      });
    });
  };
}

export default new FlowFiles();
