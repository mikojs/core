// @flow

const mockSocket: JestMockFn<
  $ReadOnlyArray<void>,
  {|
    setEncoding: JestMockFn<$ReadOnlyArray<void>, void>,
    on: JestMockFn<$ReadOnlyArray<void>, void>,
  |},
> = jest.fn().mockReturnValue({
  setEncoding: jest.fn<$ReadOnlyArray<void>, void>(),
  on: jest.fn<$ReadOnlyArray<void>, void>(),
});
const mockCreateServerOn = jest.fn<$ReadOnlyArray<void>, void>();
const mockCreateServerListen = jest.fn<$ReadOnlyArray<void>, void>();
const mockCreateServerClose = jest.fn<$ReadOnlyArray<void>, void>();

export default ({
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
}: {|
  mockSocket: typeof mockSocket,
  createServer: JestMockFn<
    [(socket: mixed) => void],
    {|
      on: typeof mockCreateServerOn,
      listen: typeof mockCreateServerListen,
      close: typeof mockCreateServerClose,
    |},
  >,
  connect: JestMockFn<
    $ReadOnlyArray<void>,
    {|
      on: JestMockFn<$ReadOnlyArray<void>, void>,
      end: JestMockFn<$ReadOnlyArray<void>, void>,
    |},
  >,
|});
