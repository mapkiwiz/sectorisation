import _ from 'lodash';

export function guessField(availableFields, pattern) {
  return _.find(availableFields, (item) => pattern.test(item));
};
