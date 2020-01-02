// @flow

export type rulesType = {
  'jsdoc/check-tag-names'?: [string, { definedTags: $ReadOnlyArray<string> }],
  'jsdoc/require-example'?: [string, { exemptedBy: $ReadOnlyArray<string> }],
  'jsdoc/require-param'?: [string, { exemptedBy: $ReadOnlyArray<string> }],
  'jsdoc/require-returns'?: [string, { exemptedBy: $ReadOnlyArray<string> }],
};

export type lintType = {
  rules: $ObjMap<rulesType, <V>(V) => V | string>,
};

/**
 * @example
 * lint({}, {})
 *
 * @param {object} rules - the old rules
 * @param {object} newRulesCallback - the new rules callback
 *
 * @return {object} - the new rules
 */
export default <R: {}, C: {}>(rules: R, newRulesCallback: C) =>
  Object.keys(newRulesCallback).reduce(
    (result: R, ruleName: $Keys<C>) => ({
      ...result,
      [ruleName]: newRulesCallback[ruleName](
        rules[ruleName] instanceof Array
          ? rules[ruleName]
          : [rules[ruleName], {}],
      ),
    }),
    rules,
  );
