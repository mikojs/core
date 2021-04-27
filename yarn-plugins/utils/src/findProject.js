import { Configuration, Project } from '@yarnpkg/core';

export default async (cwd, plugins) => {
  const configuration = await Configuration.find(cwd, plugins);

  return {
    ...(await Project.find(configuration, cwd)),
    configuration,
  };
};
