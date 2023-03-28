import React, { useState, useEffect } from 'react';
import { Form, InputNumber as InputNumberAnt } from 'antd';
const InputNumber = (props) => {
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
  const style = props.item.style || {};
  return (
    <Form.Item
      name={code}
      {...props.field}
      rules={[{ required: !!required, message: label + '不能为空' }]}
      noStyle
    >
      <InputNumberAnt
        min={0}
        max={999999}
        style={{ width: width ? width : '100%', ...style }}
        placeholder={label}
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        {...option}
      />
    </Form.Item>
  );
};

export default InputNumber;
