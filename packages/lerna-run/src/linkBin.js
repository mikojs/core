import path from 'path';

import { getPackagesSync } from '@lerna/project';

import symlinkSync from './utils/symlinkSync';

export default async remove => {
  await Promise.all(
    getPackagesSync().reduce(
      (result, { bin, rootPath, location }) => [
        ...result,
        ...Object.keys(bin).map(key =>
          symlinkSync(
            path.resolve(location, bin[key]),
            path.resolve(rootPath, './node_modules/.bin', key),
            remove,
          ),
        ),
      ],
      [],
    ),
  );
};
