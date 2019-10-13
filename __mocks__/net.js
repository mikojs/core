// @flow

/** mock net */
class Net {
  +callback = jest.fn<[string, () => void], void>();

  /**
   * @example
   * net.find('end')
   *
   * @param {string} kind - the kind of the callback
   *
   * @return {Array} - the mock of the callback
   */
  +find = (kind: string) =>
    this.callback.mock.calls.find(
      ([type]: [string, () => void]) => type === kind,
    );

  +main = {
    connect: () => ({
      end: (data: string, endCallback: () => void) => {
        this.callback('end', endCallback);
      },
      on: this.callback,
    }),
    createServer: (callback: ({}) => void): {} => {
      callback({
        setEncoding: jest.fn<$ReadOnlyArray<void>, void>(),
        on: this.callback,
      });

      return {
        on: this.callback,
        listen: (port: number, listenCallback: () => void) => {
          this.callback('listen', listenCallback);
        },
        close: (closeCallback: () => void) => {
          this.callback('close', closeCallback);
        },
      };
    },
  };
}

export const net = new Net();
export default net.main;
