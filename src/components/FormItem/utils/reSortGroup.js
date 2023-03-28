import _ from 'lodash';
/**
 * 对拖拽移动后组的校验规则进行重排
 * @param {Array} groupValue 组控制列表
 * @param {String} type 判断是删除、移动还是拖拽
 * @param {String} name 起始的name
 * @param {String} afterName 终止name
 * @returns
 */
const reSortGroup = (groupValue, type, nameList, afterName) => {
  const [name, uplevelname] = nameList;
  if (uplevelname !== undefined) {
    return reSortGroup2(groupValue, type, nameList, afterName);
  }
  if (type === 'add') {
    let groupValueClone = groupValue.filter((i) => i[0] === name);
    groupValue.push([afterName, groupValueClone.length > 0 ? groupValueClone[0][1] : []]);
  } else if (type === 'delete') {
    _.remove(groupValue, (i) => i[0] === name);
    groupValue.forEach((i, index) => {
      if (index > 0) {
        i[0] = index - 1;
      }
    });
  } else if (type === 'move') {
    groupValue.forEach((i, index) => {
      if (i[0] === name) {
        i[0] = afterName;
      } else if (i[0] === afterName) {
        i[0] = name;
      }
    });
  }

  return groupValue;
};
export default reSortGroup;

const reSortGroup2 = (groupValue, type, nameList, afterName) => {
  const [name, uplevelname] = nameList;
  if (type === 'add') {
    let groupValueClone = groupValue.filter((i) => i[0] === uplevelname && i[1] === name);

    groupValue.push([
      uplevelname,
      afterName,
      groupValueClone.length > 0 ? groupValueClone[0][2] : [],
    ]);
  } else if (type === 'delete') {
    _.remove(groupValue, (i) => i[0] === uplevelname && i[1] === name);
    groupValue.forEach((i) => {
      if (i[0] === uplevelname && i[1] > name) {
        i[1] = i[1] - 1;
      }
    });
  } else if (type === 'move') {
    groupValue.forEach((i, index) => {
      if (i[0] === uplevelname && i[1] === name) {
        i[1] = afterName;
      } else if (i[0] === uplevelname && i[1] === afterName) {
        i[1] = name;
      }
    });
  }

  return groupValue;
};
