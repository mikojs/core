// @flow

export default {
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(),
};
