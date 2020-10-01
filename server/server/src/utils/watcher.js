// @flow

export type dataType = {|
  exists: boolean,
  filePath: string,
|};

export type callbackType = (data: $ReadOnlyArray<dataType>) => void;

/**
 * @param {string} folderPath - folder path
 * @param {callbackType} callback - handle files function
 */
export default (folderPath: string, callback: callbackType) => {
  callback([{ exists: true, filePath: folderPath }]);
};
