// @flow

/** mock inquirer */
class Inquirer {
  result = {};

  +main = {
    prompt: async (): Promise<{}> => await this.result,
  };
}

export const inquirer = new Inquirer();
export default inquirer.main;
