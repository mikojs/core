// @flow

export default (packageName: string) => {
  throw new Error(
    `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
  );
};
