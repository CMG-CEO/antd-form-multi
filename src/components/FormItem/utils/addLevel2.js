import _ from 'lodash';
// 增加Form.List里面的一项
/**
 *
 * @param {Form} WForm Form
 * @param {Array || String} level1Name 第一级的名称
 * @param {Array || String} level2Name 第二级的名称
 * @param {Object} defaultValue 默认值
 * @param {Function} callback 回调，增加校验使用 返回 false 则不增加
 */
const addLevel2 = (WForm, level1Name, level2Name, defaultValue = {}, callback) => {
  if (!_.isArray(level1Name)) {
    level1Name = [level1Name];
  }
  let curData = WForm.getFieldValue(level1Name) || {};
  // 支持数组和字符串形式
  if (_.isArray(level2Name)) {
    let data = WForm.getFieldValue([...level1Name, ...level2Name]);
    if (data) {
      data.push(defaultValue);
      const str = level2Name.join('.');
      const obj = _.zipObjectDeep([str], [data]);
      _.merge(curData, obj);
    } else {
      const str = level2Name.join('.');
      const obj = _.zipObjectDeep([str], [[defaultValue]]);
      _.merge(curData, obj);
    }
  } else {
    if (curData[level2Name]) {
      curData[level2Name].push(defaultValue);
    } else {
      curData[level2Name] = [defaultValue];
    }
  }

  if (typeof callback === 'function') {
    const res = callback(curData);
    if (!res) {
      return;
    }
  }
  WForm.setFieldsValue({
    ...curData,
  });
};

export default addLevel2;
