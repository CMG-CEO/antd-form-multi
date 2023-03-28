import _ from 'lodash';
export function isGroupLevel1(group) {
  if (!_.isArray(group)) {
    return false;
  }

  for (let index = 0; index < group.length; index++) {
    const item = group[index];
    if (!_.isArray(item)) {
      return false;
    } else if (item.length !== 2) {
      return false;
    }
  }
  return true;
}
export function isGroupLevel2(group) {
  if (!_.isArray(group)) {
    return false;
  }
  for (let index = 0; index < group.length; index++) {
    const item = group[index];
    if (!_.isArray(item)) {
      return false;
    } else if (item.length !== 3) {
      return false;
    }
  }
  return true;
}
