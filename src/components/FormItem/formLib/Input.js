import React, { useState, useEffect } from 'react';
import { Form, Input as InputAnt } from 'antd';
const Input = (props) => {
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
  return type === 'text_group' ? (
    <InputAnt.Group noStyle>
      <Form.Item
        name={code}
        {...props.field}
        rules={[{ required: !!required, message: label + '不能为空' }]}
        noStyle
      >
        <InputAnt
          type={type}
          style={{ width: width ? width : '100%', ...style }}
          placeholder={label}
          onChange={(e) => props.handelTargetChange(e, onChange, props.field.name, upLevelname)}
          onBlur={(e) => props.handelBlur(e, onBlur, props.field.name, upLevelname)}
          {...option}
        />
      </Form.Item>
    </InputAnt.Group>
  ) : (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        { required: !!required, message: label + '不能为空' },
        { pattern: pattern, message: label + '格式错误' },
        {
          validator: validator || null,
        },
      ]}
      validateTrigger="onBlur"
      noStyle
    >
      {type === 'text' ? (
        <InputAnt
          type={type}
          style={{ width: width ? width : '100%', ...style }}
          placeholder={label}
          onChange={(e) => props.handelTargetChange(e, onChange, props.field.name, upLevelname)}
          onBlur={(e) => props.handelBlur(e, onBlur, props.field.name, upLevelname)}
          {...option}
        />
      ) : type === 'password' ? (
        <InputAnt.Password
          type={type}
          style={{ width: width ? width : '100%', ...style }}
          placeholder={label}
          onChange={(e) => props.handelTargetChange(e, onChange, props.field.name, upLevelname)}
          onBlur={(e) => props.handelBlur(e, onBlur, props.field.name, upLevelname)}
          {...option}
        />
      ) : (
        <InputAnt.TextArea
          style={{ overflow: 'auto', ...style }}
          onChange={(e) => props.handelTargetChange(e, onChange, props.field.name, upLevelname)}
          rows={4}
          {...option}
        />
      )}
    </Form.Item>
  );
};

export default Input;
