import React, { useState, useEffect } from 'react';
import { Form, Row, Select as SelectAnt, TreeSelect, Button, Divider } from 'antd';
import _ from 'lodash';
const Select = (props) => {
  let {
    upLevelname,
    type,
    code,
    label,
    required,
    pattern,
    validator,
    dataDisplayType,
    width,
    range,
    options,
    refresh,
    autoMatch,
    dropdownRenderContentFlase,
    dropdownRenderContentItem,
    // 以上
    onBlur,
    onChange,
    onRefresh,
    ...option
  } = props.item;
  const style = props.item.style || {};
  const multiple = type === 'select_multi';

  const dropdownRenderContent = (params) => {
    let dropdownRenderContent = null;
    if (refresh === 1 && options.length === 0) {
      dropdownRenderContent = (
        <Row type="flex" style={{ width: '100%' }} justify="center" align="middle" gutter={[12]}>
          <Button onClick={() => onRefresh()} size="small">
            刷新
          </Button>
          <Divider style={{ margin: '8px 0' }} />
        </Row>
      );
    } else if (dropdownRenderContentFlase) {
      dropdownRenderContent = dropdownRenderContentItem;
    } else {
      dropdownRenderContent =
        !!multiple && options.length > 0 ? (
          <>
            <Row
              type="flex"
              style={{ width: '100%' }}
              justify="center"
              align="middle"
              gutter={[12]}
            >
              <Button
                style={{ marginRight: '10px' }}
                onClick={() =>
                  props.handelSelectAll(true, props.item, onChange, props.field.name, upLevelname)
                }
                size="small"
              >
                全选列表
              </Button>
              <Button
                onClick={() =>
                  props.handelSelectAll(false, props.item, onChange, props.field.name, upLevelname)
                }
                size="small"
              >
                取消全选
              </Button>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
          </>
        ) : null;
    }
    return dropdownRenderContent;
  };
  return dataDisplayType === 2 ? (
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
      <TreeSelect
        onChange={(e) => props.handelValueChange(e, onChange, props.field.name, upLevelname)}
        autoClearSearchValue={false}
        maxTagCount={5}
        style={{ width: width ? width : '100%', ...style }}
        showArrow={true}
        allowClear={!!!required || !!multiple}
        dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
        treeData={options}
        placeholder={'请选择'}
        {...option}
      />
    </Form.Item>
  ) : (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        {
          required: required,
          message: '请选择' + label,
        },
      ]}
      noStyle
    >
      <SelectAnt
        onChange={(e, selectChilds) =>
          props.handelValueChange(e, onChange, props.field.name, upLevelname, selectChilds)
        }
        showSearch
        autoClearSearchValue={false}
        allowClear={!!!required}
        maxTagCount={5}
        showArrow={true}
        defaultActiveFirstOption={false}
        mode={multiple ? 'multiple' : null}
        placeholder={'请选择'}
        popupClassName="ww-select-wrap"
        // 根据name进行搜索
        // autoMatch 可以根据 , 进行不同条件搜索
        filterOption={(inputValue, option) => {
          const propsChildren = String(option.props.children);
          if (autoMatch === 1) {
            let domainArray = inputValue.split(',');
            for (let i = 0; i < domainArray.length; i++) {
              if (propsChildren.indexOf(domainArray[i]) > -1) {
                return true;
              }
            }
            return false;
          } else {
            return propsChildren.indexOf(inputValue) > -1;
          }
        }}
        onSearch={(inputValue) => {
          if (autoMatch === 1) {
            let curValues = this.formRef.current.getFieldValue({ code });
            let valueArray = inputValue.split(',');
            let matchArray = [];
            let valueSet = new Set();
            for (let i = 0; i < valueArray.length; i++) {
              if (valueSet.has(valueArray[i])) {
                matchArray.push(valueArray[i]);
              }
            }

            for (let i = 0; i < matchArray.length; i++) {
              let notExist = true;
              for (let j = 0; j < curValues.length; j++) {
                if (matchArray[i] == curValues[j]) {
                  notExist = false;
                  break;
                }
              }
              if (notExist) {
                curValues.push(matchArray[i]);
              }
            }

            let updateValue = {};
            updateValue[code] = curValues;
            this.formRef.current.setFieldsValue(updateValue);
            this.handelValueChange(curValues);
          }
        }}
        dropdownRender={(menu, props) => (
          <>
            {dropdownRenderContent()}
            {menu}
          </>
        )}
        style={{ width: width ? width : '100%' }}
        {...option}
      >
        {_.isArray(options)
          ? options.map((item) => (
              <SelectAnt.Option key={item.id || item.value} value={item.id || item.value}>
                {item.name || item.label}
              </SelectAnt.Option>
            ))
          : typeof options === 'function'
          ? options(props.field.name, upLevelname).map((item) => (
              <SelectAnt.Option key={item.id || item.value} value={item.id || item.value}>
                {item.name || item.label}
              </SelectAnt.Option>
            ))
          : null}
      </SelectAnt>
    </Form.Item>
  );
};

export default Select;
