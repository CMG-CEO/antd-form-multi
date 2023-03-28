import React from 'react';
import { Form } from 'antd';
const Template = (props) => {
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
    <Form.Item name={code} rules={rules} noStyle>
      {typeof option.template === 'function'
        ? option.template(props.field.name, upLevelname)
        : option.template}
    </Form.Item>
  );
};

export default Template;
