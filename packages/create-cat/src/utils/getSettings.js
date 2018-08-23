// @flow

import fs from 'fs';
import path from 'path';

import * as d3 from 'd3-hierarchy';
import inquirer from 'inquirer';
import { snakeCase } from 'lodash';

const transformConfig = config =>
  config.reduce(
    (result, [parent, childData]) => [
      ...result,
      ...childData.map(name => ({
        name,
        parent,
      })),
    ],
    [{ name: 'root', parent: '' }],
  );

const getTreeStructure = d3
  .stratify()
  .id(({ name }) => name)
  .parentId(({ parent }) => parent);

const configsDir = path.resolve(__dirname, '../configs');

export default async () =>
  getTreeStructure(
    transformConfig(
      await inquirer
        .prompt([
          {
            name: 'configName',
            type: 'list',
            message: 'choose config',
            choices: fs
              .readdirSync(configsDir)
              .filter(name => /\.js$/.test(name))
              .map(name => {
                const configName = name.replace(/\.js$/, '');

                return {
                  name: snakeCase(configName).replace(/_/g, ' '),
                  value: configName,
                };
              }),
          },
        ])
        .then(({ configName }) =>
          require(path.resolve(configsDir, configName)),
        ),
    ),
  ).leaves();
