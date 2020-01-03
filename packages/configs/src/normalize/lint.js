// @flow

export type rulesType = {
  'jsdoc/check-tag-names'?: [string, { definedTags: $ReadOnlyArray<string> }],
  'jsdoc/require-example'?: [string, { exemptedBy: $ReadOnlyArray<string> }],
  'jsdoc/require-param'?: [string, { exemptedBy: $ReadOnlyArray<string> }],
  'jsdoc/require-returns'?: [string, { exemptedBy: $ReadOnlyArray<string> }],
};

export type lintType = {
  rules?: $ObjMap<rulesType, <V>(V) => V | string>,
};

/**
 * @example
 * removeEmptyOption(['error'])
 *
 * @param {Array} rule - rule option
 *
 * @return {string | Array} - new rule option
 */
const removeEmptyOption = (rule: [string, {}]) =>
  Object.keys(rule[1] || {}).length === 0 ? rule[0] : rule;

export default {
  rules: <C: {}>(
    rules: $PropertyType<lintType, 'rules'>,
    newRulesCallback: C,
  ) =>
    Object.keys(newRulesCallback).reduce(
      (result: $PropertyType<lintType, 'rules'>, ruleName: $Keys<C>) => ({
        ...result,
        [ruleName]: removeEmptyOption(
          newRulesCallback[ruleName](
            rules?.[ruleName] instanceof Array
              ? rules?.[ruleName]
              : [rules?.[ruleName], {}],
          ),
        ),
      }),
      rules,
    ),
};
