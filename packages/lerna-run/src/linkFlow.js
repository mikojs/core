import path from 'path';

import { getPackagesSync } from '@lerna/project';

import symlinkSync from './utils/symlinkSync';

export default async remove => {
  const packages = getPackagesSync();

  await Promise.all(
    packages.map(
      async ({ rootPath, location, dependencies, devDependencies }) => {
        await symlinkSync(
          path.resolve(rootPath, './.flowconfig'),
          path.resolve(location, './.flowconfig'),
          remove,
        );
        await Promise.all(
          [dependencies, devDependencies].reduce(
            (result, data) => [
              ...result,
              ...Object.keys(data || {}).map(async key => {
                const pkg = packages.find(({ name }) => name === key);

                await symlinkSync(
                  pkg?.location ||
                    path.resolve(rootPath, './node_modules', key),
                  path.resolve(location, './node_modules', key),
                  remove,
                );
              }),
            ],
            [],
          ),
        );
      },
    ),
  );
};
