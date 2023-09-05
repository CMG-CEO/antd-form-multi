import _ from 'lodash';

//   列表内 增加一项的处理函数，也可单独使用
/**
 *
 * @param {FormRef} WForm 类组件要传Ref.current Form的ref
 * @param {Array || String} LevelName 增加第一级的名称支持数组写法
 * @param {Object} defaultValue 添加列表需要的默认值
 */
const addLevel1 = (WForm, LevelName, defaultValue = undefined) => {
  if (!_.isArray(LevelName)) {
    LevelName = [LevelName];
  }
  const list = WForm.getFieldValue(LevelName) || [];
  const nextList = defaultValue ? list.concat(defaultValue) : list;
  const str = LevelName.join('.');
  const obj = _.zipObjectDeep([str], [nextList]);

  WForm.setFieldsValue({
    ...obj,
  });
};

export default addLevel1;
