// @flow

import fs from 'fs';
import path from 'path';

import cliOptions from './cliOptions';

const pkgPath = path.resolve(cliOptions.projectDir, './package.json');
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};

if (!pkg.scripts) pkg.scripts = {};
if (!pkg.dependencies) pkg.dependencies = {};
if (!pkg.devDependencies) pkg.devDependencies = {};

export default pkg;
