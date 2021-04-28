import fs from 'fs';
import path from 'path';

const findBuilder = (cwd = __dirname) => {
  const filePath = path.resolve(cwd, './node_modules/.bin/builder');

  if (cwd === '/') return null;

  return fs.existsSync(filePath) ? filePath : findBuilder(path.dirname(cwd));
};

export default findBuilder;
