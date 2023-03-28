import React, { useState, useEffect } from 'react';
import { Form, Switch as SwitchAnt } from 'antd';
const Switch = (props) => {
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
    // 以上
    onBlur,
    onChange,
    ...option
  } = props.item;
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
      valuePropName="checked"
      noStyle
    >
      <SwitchAnt
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        {...option}
      />
    </Form.Item>
  );
};

export default Switch;
