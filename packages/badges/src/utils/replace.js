// @flow

import get from 'lodash.get';

import badges, { type ctxType, type badgeType } from './badges';

const START_COMMENT = '<!-- badges.start -->';
const END_COMMENT = '<!-- badges.end -->';

/**
 * @param {string} readme - readme string
 * @param {ctxType} ctx - context value
 *
 * @return {string} - badges string
 */
export default (readme: string, ctx: ctxType): string => {
  const usedBadges = badges.filter(({ skip }: badgeType) => !skip(ctx));

  return readme
    .replace(
      new RegExp(`${START_COMMENT}(.|\n)*${END_COMMENT}`, 'g'),
      `${START_COMMENT}${usedBadges
        .map(({ name, link }: badgeType) =>
          !link
            ? `![${name}][${name}-image]`
            : `[![${name}][${name}-image]][${name}-link]`,
        )
        .join(' ')}

${usedBadges
  .map(
    ({ name, image, link }: badgeType) =>
      `[${name}-image]: ${image}${!link ? '' : `\n[${name}-link]: ${link}`}`,
  )
  .join('\n')}

${END_COMMENT}`,
    )
    .replace(/{{ (.*) }}/g, (str: string, p1: string): string => {
      const value = get(ctx, p1);

      if (!value) throw new Error(`Could not find ${p1} in context.`);

      return encodeURI(value);
    });
};
