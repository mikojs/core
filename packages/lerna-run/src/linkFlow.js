import path from 'path';

import { getPackagesSync } from '@lerna/project';

import symlinkSync from './utils/symlinkSync';

export default async remove => {
  const packages = getPackagesSync();

  await Promise.all(
    packages.reduce(
      (result, { rootPath, location, dependencies, devDependencies }) =>
        [dependencies, devDependencies].reduce(
          (subResult, data) => [
            ...subResult,
            ...Object.keys(data || {}).map(key =>
              symlinkSync(
                packages.find(({ name }) => name === key)?.location ||
                  path.resolve(rootPath, './node_modules', key),
                path.resolve(location, './node_modules', key),
                remove,
              ),
            ),
          ],
          [
            ...result,
            symlinkSync(
              path.resolve(rootPath, './.flowconfig'),
              path.resolve(location, './.flowconfig'),
              remove,
            ),
          ],
        ),
      [],
    ),
  );
};
