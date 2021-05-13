export default (filters, filterKey) => filters.reduce((result, filter) => [
  ...result,
  filterKey,
  filter,
], []);
