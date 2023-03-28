export const wrapRemove = (field, remove) => {
  const reSortGroup = this.props.reSortGroup || function () {};
  reSortGroup('delete', field.name);
  remove(field.name);
};
export const wrapCopy = (field, add) => {
  const { nameLevel1 } = this.props;
  const fieldValue = this.formRef.current.getFieldValue(nameLevel1);
  return add(fieldValue[field.name]);
};
export const wrapUpMove = (field, move) => {
  const reSortGroup = this.props.reSortGroup || function () {};
  if (field.name !== 0) {
    reSortGroup('move', field.name, field.name - 1);
    return move(field.name, field.name - 1);
  }
};
export const wrapDownMove = (field, fields, move) => {
  const reSortGroup = this.props.reSortGroup || function () {};
  if (field.name !== fields.length - 1) {
    reSortGroup('move', field.name, field.name + 1);
    move(field.name, field.name + 1);
  }
};
