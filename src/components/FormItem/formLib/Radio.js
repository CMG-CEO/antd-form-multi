import React, { useState, useEffect } from 'react';
import { Form, Radio as RadioAnt } from 'antd';
const Radio = (props) => {
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
    options,
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
      <RadioAnt.Group
        style={{ width: width ? width : '100%', ...style }}
        onChange={(e) => props.handelTargetChange(e, onChange, props.field.name, upLevelname)}
        {...option}
      >
        {options?.map((item) => {
          return type === 'radio' ? (
            <RadioAnt
              disabled={!!item.disabled}
              key={item.id || item.value}
              value={item.id || item.value}
            >
              {item.name || item.label}
            </RadioAnt>
          ) : (
            <RadioAnt.Button
              disabled={!!item.disabled}
              key={item.id || item.value}
              value={item.id || item.value}
            >
              <div>{item.name || item.label}</div>
            </RadioAnt.Button>
          );
        })}
      </RadioAnt.Group>
    </Form.Item>
  );
};

export default Radio;
