// @flow

import { outputFileSync } from 'output-file-sync';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import {
  transformFileOptions,
  transformFolderOptions,
  indexFiles,
  hasFlowFileFiles,
} from './__ignore__/constants';

import flowFiles from 'utils/flowFiles';
import writeFiles from 'utils/writeFiles';

import type { writeFileType } from 'utils/writeFiles';

test('transform file', () => {
  reset(transformFileOptions);
  babel();

  expect(outputFileSync.destPaths).toEqual(indexFiles);
});

describe('transform folder', () => {
  beforeEach(() => {
    reset(transformFolderOptions);
  });

  it('transform file which do not have the same name file and extension is `.js.flow`', () => {
    babel();
    expect(outputFileSync.destPaths).toEqual(indexFiles);

    babel();
    expect(outputFileSync.destPaths).toEqual([
      ...indexFiles,
      'lib/index.js.flow',
    ]);
  });

  it('transform file which have the same name file and extension is `.js.flow`', () => {
    babel('hasFlowFile.js');
    expect(outputFileSync.destPaths).toEqual(hasFlowFileFiles);

    babel('hasFlowFile.js');
    expect(outputFileSync.destPaths).toEqual(hasFlowFileFiles);
  });
});

describe('write file before previous file is done', () => {
  beforeAll(() => {
    // Generate flow file in store
    reset(transformFileOptions);
    babel();
  });

  it('Add file when previous file is not done.', () => {
    const [flowFile] = flowFiles.store;

    expect(outputFileSync.destPaths).toEqual(indexFiles);

    writeFiles.isWritting = true;
    writeFiles.add(flowFile);

    expect(outputFileSync.destPaths).toEqual(indexFiles);
    expect(
      Boolean(
        writeFiles.store.find(
          ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
        ),
      ),
    ).toBeTruthy();
  });

  it('Previous file is done. Write file and remove same file in the store.', () => {
    const [flowFile] = flowFiles.store;

    expect(outputFileSync.destPaths).toEqual(indexFiles);
    expect(
      Boolean(
        writeFiles.store.find(
          ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
        ),
      ),
    ).toBeTruthy();

    writeFiles.isWritting = false;
    writeFiles.add(flowFile);

    expect(outputFileSync.destPaths).toEqual([
      ...indexFiles,
      flowFile.destPath,
    ]);
    expect(
      Boolean(
        writeFiles.store.find(
          ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
        ),
      ),
    ).toBeFalsy();
  });
});

test('Store is not clean after writting file', () => {
  reset(transformFolderOptions);
  babel();

  const [flowFile] = flowFiles.store;

  expect(outputFileSync.destPaths).toEqual(indexFiles);

  writeFiles.isWritting = true;
  writeFiles.add(flowFile);

  expect(outputFileSync.destPaths).toEqual(indexFiles);
  expect(
    Boolean(
      writeFiles.store.find(
        ({ srcPath }: writeFileType): boolean => srcPath === flowFile.srcPath,
      ),
    ),
  ).toBeTruthy();

  writeFiles.isWritting = false;
  babel('hasFlowFile.js');

  expect(outputFileSync.destPaths).toEqual([
    ...indexFiles,
    ...hasFlowFileFiles,
    flowFile.destPath,
  ]);
});
