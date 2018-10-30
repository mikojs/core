// @flow

import { execa } from 'execa';

import handleError from '../handleError';
import cache from '../cache';

describe('handle error', () => {
  it('can not handle', () => {
    expect(handleError('can not handle')).toBeFalsy();
  });

  describe('command not found', () => {
    beforeEach(() => {
      execa.cmds = [];
      cache.store = { packages: [] };
    });

    it('can install packages', async (): Promise<void> => {
      expect(
        await handleError('/bin/sh: packages: command not found\n'),
      ).toBeTruthy();
      expect(execa.cmds).toEqual([
        'npm i --no-package-lock --no-save packages',
      ]);
    });

    it('can not install packages', async (): Promise<void> => {
      execa.mainFunction = () => {
        throw new Error('can not install packages');
      };

      expect(
        await handleError('/bin/sh: packages: command not found\n'),
      ).toBeFalsy();
      expect(execa.cmds).toEqual([]);
    });
  });
});
