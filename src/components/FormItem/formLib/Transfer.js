import React from 'react';
import { Form, Transfer as TransferAnt } from 'antd';
const Transfer = (props) => {
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
      <TransferAnt render={(item) => item.title} {...option} />
    </Form.Item>
  );
};

export default Transfer;
