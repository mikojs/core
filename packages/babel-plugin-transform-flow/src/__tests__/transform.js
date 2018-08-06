// @flow

import { resetDestPaths, getDestPaths } from 'output-file-sync';

import flowFiles from '../flowFiles';
import writeFiles from '../writeFiles';

import type { writeFileType } from '../writeFiles';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import {
  transformFileOptions,
  transformFolderOptions,
  indexFiles,
  hasFlowFileFiles,
} from './__ignore__/constants';

test('transform file', () => {
  reset(transformFileOptions);
  resetDestPaths();
  babel();

  expect(getDestPaths()).toEqual(indexFiles);
});

describe('transform folder', () => {
  beforeEach(() => {
    reset(transformFolderOptions);
    resetDestPaths();
  });

  it('transform file which do not have the same name file and extension is `.js.flow`', () => {
    babel();
    expect(getDestPaths()).toEqual(indexFiles);

    babel();
    expect(getDestPaths()).toEqual([...indexFiles, 'lib/index.js.flow']);
  });

  it('transform file which have the same name file and extension is `.js.flow`', () => {
    babel('hasFlowFile.js');
    expect(getDestPaths()).toEqual(hasFlowFileFiles);

    babel('hasFlowFile.js');
    expect(getDestPaths()).toEqual(hasFlowFileFiles);
  });
});

describe('write file before previous file is done', () => {
  beforeAll(() => {
    // Generate flow file in store
    reset(transformFileOptions);
    resetDestPaths();
    babel();
  });

  it('Add file when previous file is not done.', () => {
    const [flowFile] = flowFiles.store;

    expect(getDestPaths()).toEqual(indexFiles);

    writeFiles.isWritting = true;
    writeFiles.add(flowFile);

    expect(getDestPaths()).toEqual(indexFiles);
    expect(
      !!writeFiles.store.find(
        ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
      ),
    ).toBeTruthy();
  });

  it('Previous file is done. Write file and remove same file in the store.', () => {
    const [flowFile] = flowFiles.store;

    expect(getDestPaths()).toEqual(indexFiles);
    expect(
      !!writeFiles.store.find(
        ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
      ),
    ).toBeTruthy();

    writeFiles.isWritting = false;
    writeFiles.add(flowFile);

    expect(getDestPaths()).toEqual([...indexFiles, flowFile.destPath]);
    expect(
      !!writeFiles.store.find(
        ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
      ),
    ).toBeFalsy();
  });
});

test('Store is not clean after writting file', () => {
  reset(transformFolderOptions);
  resetDestPaths();
  babel();

  const [flowFile] = flowFiles.store;

  expect(getDestPaths()).toEqual(indexFiles);

  writeFiles.isWritting = true;
  writeFiles.add(flowFile);

  expect(getDestPaths()).toEqual(indexFiles);
  expect(
    !!writeFiles.store.find(
      ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
    ),
  ).toBeTruthy();

  writeFiles.isWritting = false;
  babel('hasFlowFile.js');

  expect(getDestPaths()).toEqual([
    ...indexFiles,
    ...hasFlowFileFiles,
    flowFile.destPath,
  ]);
});
