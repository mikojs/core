// @flow

const mockSocket = jest.fn().mockReturnValue({
  setEncoding: jest.fn(),
  on: jest.fn(),
});
const mockCreateServerOn = jest.fn();
const mockCreateServerListen = jest.fn();
const mockCreateServerClose = jest.fn();

export default {
  mockSocket,
  createServer: jest
    .fn()
    .mockImplementation((callback: (socket: mixed) => void): {|
      on: typeof mockCreateServerOn,
      listen: typeof mockCreateServerListen,
      close: typeof mockCreateServerClose,
    |} => {
      callback(mockSocket());

      return {
        on: mockCreateServerOn,
        listen: mockCreateServerListen,
        close: mockCreateServerClose,
      };
    }),
  connect: jest.fn().mockReturnValue({
    on: jest.fn(),
    end: jest.fn(),
  }),
};
