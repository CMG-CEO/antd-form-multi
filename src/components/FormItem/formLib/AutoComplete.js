import React, { useState, useEffect } from 'react';
import { Form, Space, AutoComplete as AutoCompleteAnt } from 'antd';
import _ from 'lodash';
const AutoComplete = (props) => {
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
  const newDict = [];
  // eslint-disable-next-line no-lone-blocks
  {
    _.isArray(options)
      ? options.forEach((item) => {
          newDict.push({
            label: item.name || item.label,
            value: item.id || item.value,
          });
        })
      : options().forEach((item) => {
          newDict.push({
            label: item.name || item.label,
            value: item.id || item.value,
          });
        });
  }
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
      <AutoCompleteAnt
        options={newDict}
        filterOption={(inputValue, option) => {
          const value = String(option.value);
          return value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
        }}
      />
    </Form.Item>
  );
};

export default AutoComplete;
