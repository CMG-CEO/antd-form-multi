import React, { useState, useEffect } from 'react';
import { Form, DatePicker as DatePickerAnt } from 'antd';
import dayjs from 'dayjs';
const DatePicker = (props) => {
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

  function disabledDate(range) {
    return function (current) {
      if (range === undefined) {
        return current > dayjs().endOf('day');
      } else {
        const startDate = !!range[0] ? range[0] : -1;
        const endDate = !!range[1] ? range[1] : dayjs().add(100, 'year').endOf('day');

        return current > endDate || current < startDate;
      }
    };
  }
  return type === 'datePicker' ? (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        {
          type: 'object',
          required: !!required,
          message: '请选择' + label,
        },
      ]}
      noStyle
    >
      <DatePickerAnt
        style={{ width: width ? width : '100%', ...style }}
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        disabledDate={disabledDate(range)}
        format="YYYY-MM-DD HH:mm:ss"
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
      <DatePickerAnt.RangePicker
        style={{ width: width ? width : '100%', ...style }}
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        allowClear={!!!required}
        disabledDate={disabledDate(range)}
        {...option}
      />
    </Form.Item>
  );
};

export default DatePicker;
