import React, { useState, useEffect } from 'react';
import { Form, Space, Checkbox as CheckboxAnt } from 'antd';
const Checkbox = (props) => {
  let {
    upLevelname,
    type,
    code,
    label,
    required,
    pattern,
    validator,
    width,
    range,
    dict,
    // 以上
    onBlur,
    onChange,
    ...option
  } = props.item;
  const style = props.item.style || {};
  return (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        {
          required: !!required,
          message: '请选择' + label,
        },
      ]}
      noStyle
    >
      <CheckboxAnt.Group
        style={{ width: width ? width : '100%', ...style }}
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        {...option}
      >
        <Space direction={option.direction}>
          {dict.map((item) => (
            <CheckboxAnt disabled={!!item.disabled} key={item.id} value={item.id}>
              {item.name}
            </CheckboxAnt>
          ))}
        </Space>
      </CheckboxAnt.Group>
    </Form.Item>
  );
};

export default Checkbox;
