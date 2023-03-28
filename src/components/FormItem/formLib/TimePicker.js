import React, { useState, useEffect } from 'react';
import { Form, TimePicker as TimePickerAnt } from 'antd';
import dayjs from 'dayjs';
const TimePicker = (props) => {
  let {
    upLevelname,
    type,
    code,
    label,
    required,
    width,
    range,
    // 以上
    onBlur,
    onChange,
    ...option
  } = props.item;
  const style = props.item.style || {};
  return type === 'timePicker' ? (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        {
          type: 'array',
          required: !!required,
          message: '请选择' + label,
        },
      ]}
      noStyle
    >
      <TimePickerAnt
        style={{ width: width ? width : '100%', ...style }}
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        {...option}
      />
    </Form.Item>
  ) : (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        {
          type: 'array',
          required: !!required,
          message: '请选择' + label,
        },
      ]}
      noStyle
    >
      <TimePickerAnt.RangePicker
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        style={{ width: width ? width : '100%', ...style }}
        {...option}
      />
    </Form.Item>
  );
};

export default TimePicker;
