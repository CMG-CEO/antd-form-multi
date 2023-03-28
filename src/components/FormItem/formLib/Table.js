import React from 'react';
import { Form, Table as TableAnt } from 'antd';
const Table = (props) => {
  let {
    upLevelname,
    type,
    code,
    label,
    required,
    pattern,
    validator,
    rules,
    width,
    range,
    dict,
    // 以上
    onBlur,
    onChange,
    ...option
  } = props.item;
  return (
    <Form.Item name={code} noStyle rules={[{ required: !!required, message: '请选择' + label }]}>
      <TableAnt rowKey={'key'} indentSize={15} pagination={false} {...option} />
    </Form.Item>
  );
};

export default Table;
