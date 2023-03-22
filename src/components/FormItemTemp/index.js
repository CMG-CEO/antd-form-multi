import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  Radio,
  InputNumber,
  Input,
  TreeSelect,
  Select,
  Checkbox,
  DatePicker,
  Switch,
  Upload,
  Button,
  TimePicker,
  Divider,
  Transfer,
  Table,
  Row,
  Col,
  Space,
  AutoComplete,
} from 'antd';
import { ReactSortable } from 'react-sortablejs';
import { wrapCardComponent, sortableNull } from './FormWrapCard';
import _ from 'lodash';

function disabledDate(range) {
  return function (current) {
    if (range === undefined) {
      // Can not select days before today and today
      return current > moment().endOf('day');
    } else {
      const startDate = !!range[0] ? range[0] : -1;
      const endDate = !!range[1] ? range[1] : moment().add(100, 'year').endOf('day');

      return current > endDate || current < startDate;
    }
  };
}
const moment = dayjs;

const IsRowLayout = (props) => {
  return props.isrow ? (
    <Row type="flex" justify="center" align="top">
      {props.children}
    </Row>
  ) : (
    <>{props.children}</>
  );
};
const WrapSpace = (option) => {
  return option.notSpace ? (
    <>{option.children}</>
  ) : (
    <Space direction={option.direction}>{option.children}</Space>
  );
};

class FormItemTemp extends PureComponent {
  formRef = this.props.forwardedref;

  constructor(props) {
    super(props);

    this.state = {};
  }
  normFile = (e) => {
    // console.log('Upload event:', e);
    /* if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList; */
    if (e.fileList.length === 0) {
      return [];
    }
    return [e.file];
  };

  handelValueChange(value, perentFun, name, editId, selectChilds) {
    if (typeof perentFun === 'function') {
      perentFun(value, name, editId, selectChilds);
    }
  }

  handelTargetChange(value, perentFun, name, editId) {
    if (typeof perentFun === 'function') {
      perentFun(value.target.value, name, editId);
    }
  }

  handelBlur(value, perentFun, name, editId) {
    if (typeof perentFun === 'function') {
      perentFun(value.target.value, name, editId);
    }
  }

  handelSelectAll(isSelectAll, item, onChange, fieldName, editId) {
    let { dict, code } = item;
    if (typeof dict === 'function') {
      dict = dict(fieldName, editId);
    }
    const currValue = this.formRef?.current?.getFieldValue(code);
    let values = [];
    const textValue = !!item.textValue
      ? {
          text: 'name',
          value: 'id',
          ...item.textValue,
        }
      : { text: 'name', value: 'id' };

    if (this.keyword === undefined || this.keyword === '') {
      if (isSelectAll) {
        values = (dict || []).map((item) => {
          return item[textValue.value] !== undefined ? item[textValue.value] : item['id'];
        });
      } else {
        values = [];
      }
    } else {
      //如果有搜索，则只选择/反选搜索结果数据
      const searchResult = (dict || []).filter((item) => {
        return item[textValue.text].indexOf(this.keyword) > -1;
      });

      const _values = searchResult.map((item) => {
        return item[textValue.value] !== undefined ? item[textValue.value] : item['id'];
      });

      if (isSelectAll) {
        values = [...new Set([..._values, ...currValue])];
      } else {
        currValue.forEach((item) => {
          if (!_values.includes(item)) {
            values.push(item);
          }
        });
      }
    }
    const obj = _.zipObjectDeep([code], [values]);
    console.log('obj', obj);
    setTimeout(() => {
      if (this.formRef?.current) {
        if (this.props.editName) {
          const listName = this.formRef.current.getFieldValue(this.props.listName);
          // 找两级
          listName[editId][this.props.editName][fieldName[0]][fieldName[1]] = obj[fieldName[1]];
          this.formRef.current.setFieldsValue({
            ...listName,
          });
        } else if (this.props.listName) {
          const listName = this.formRef.current.getFieldValue(this.props.listName);
          // 找一级
          Object.assign(listName[fieldName[0]], obj);
          this.formRef.current.setFieldsValue({
            ...listName,
          });
        } else {
          this.formRef.current.setFieldsValue({
            ...obj,
          });
        }
      }
    }, 200);
    this.handelValueChange(values, onChange, fieldName, editId);
  }

  downloadFile(file) {
    function fileDownload(url, filename) {
      getBlob(url, function (blob) {
        saveAs(blob, filename);
      });
    }
    function getBlob(url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (xhr.status === 200) {
          cb(xhr.response);
        }
      };
      xhr.send();
    }
    function saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
      }
    }
    if (file && file.url) {
      const tagA = document.createElement('a');

      tagA.setAttribute('href', 'javascript:void(0)');
      //   tagA.setAttribute('href', file.url);
      tagA.setAttribute('onclick', fileDownload(file.url, file.name));
      //   tagA.setAttribute('download', file.name);
      tagA.click();
    }
  }

  handelSearch = (keyword) => {
    this.keyword = keyword;
  };
  wrapCardAction = () => {
    return <></>;
  };

  itemComponents = (item, field = {}) => {
    let temp = null;
    let {
      editId,
      type,
      code,
      label,
      required,
      dict,
      defaultValue,
      dataDisplayType,
      pattern,
      range,
      width,
      refresh,
      onRefresh,
      dateFormat,
      autoMatch,
      hideShortcutKey,
      parser,
      validator,
      dropdownRenderContentFlase,
      dropdownRenderContentItem,
      //   取出来，防止option 的干扰
      vertical,
      labelCol,
      wrapperCol,
      span,
      shouldUpdate,
      isrow,
      // 以上
      onBlur,
      onChange,
      ...option
    } = item;
    const style = item.style || {};
    switch (type) {
      case 'datePicker':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                type: 'object',
                required: !!required,
                message: '请选择' + label,
              },
            ]}
            noStyle
          >
            <DatePicker
              style={{ width: width ? width : '100%', ...style }}
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              disabledDate={disabledDate(range)}
              format="YYYY-MM-DD HH:mm:ss"
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'rangePicker':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                type: 'array',
                required: !!required,
                message: '请选择' + label,
              },
            ]}
            noStyle
          >
            <DatePicker.RangePicker
              style={{ width: width ? width : '100%', ...style }}
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              allowClear={!!!required}
              disabledDate={disabledDate(range)}
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'timePicker':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                type: 'array',
                required: !!required,
                message: '请选择' + label,
              },
            ]}
            noStyle
          >
            <TimePicker
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              style={{ width: width ? width : '100%', ...style }}
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'timeRangePicker':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                type: 'array',
                required: !!required,
                message: '请选择' + label,
              },
            ]}
            noStyle
          >
            <TimePicker.RangePicker
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              style={{ width: width ? width : '100%', ...style }}
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'switch':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                required: !!required,
                message: '请选择' + item.label,
              },
            ]}
            valuePropName="checked"
            noStyle
          >
            <Switch
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'radio_button':
      case 'radio':
        // direction 垂直水平方向
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                required: !!required,
                message: '请选择' + item.label,
              },
            ]}
            noStyle
          >
            <Radio.Group
              style={{ width: width ? width : '100%', ...style }}
              onChange={(e) => this.handelTargetChange(e, onChange, field.name, editId)}
              {...option}
            >
              <WrapSpace direction={option.direction} notSpace={option.notSpace}>
                {dict?.map((item) => {
                  return type === 'radio' ? (
                    <Radio disabled={!!item.disabled} key={item.id} value={item.id}>
                      {item.name}
                    </Radio>
                  ) : (
                    <Radio.Button disabled={!!item.disabled} key={item.id} value={item.id}>
                      <div className="ell">{item.name}</div>
                    </Radio.Button>
                  );
                })}
              </WrapSpace>
            </Radio.Group>
          </Form.Item>
        );
        break;
      case 'checkbox':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                required: !!required,
                message: '请选择' + label,
              },
            ]}
          >
            <Checkbox.Group
              style={{ width: width ? width : '100%', ...style }}
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              {...option}
            >
              <Space direction={option.direction}>
                {dict.map((item) => (
                  <Checkbox disabled={!!item.disabled} key={item.id} value={item.id}>
                    {item.name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        );
        break;
      case 'text':
      case 'password':
      case 'textarea':
        temp = (
          <Form.Item
            name={code}
            {...field}
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
              <Input
                type={type}
                style={{ width: width ? width : '100%', ...style }}
                placeholder={label}
                onChange={(e) => this.handelTargetChange(e, onChange, field.name, editId)}
                onBlur={(e) => this.handelBlur(e, onBlur, field.name, editId)}
                {...option}
              />
            ) : type === 'password' ? (
              <Input.Password
                type={type}
                style={{ width: width ? width : '100%', ...style }}
                placeholder={label}
                onChange={(e) => this.handelTargetChange(e, onChange, field.name, editId)}
                onBlur={(e) => this.handelBlur(e, onBlur, field.name, editId)}
                {...option}
              />
            ) : (
              <Input.TextArea
                style={{ overflow: 'auto', ...style }}
                onChange={(e) => this.handelTargetChange(e, onChange, field.name, editId)}
                rows={4}
                {...option}
              />
            )}
          </Form.Item>
        );
        break;
      case 'number_text':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[{ required: !!required, message: label + '不能为空' }]}
            noStyle
          >
            <InputNumber
              min={0}
              max={999999}
              style={{ width: width ? width : '100%', ...style }}
              placeholder={label}
              onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'text_group':
        temp = (
          <Input.Group noStyle>
            <Form.Item
              name={code}
              {...field}
              rules={[{ required: !!required, message: label + '不能为空' }]}
              noStyle
            >
              <Input
                type={type}
                style={{ width: width ? width : '100%', ...style }}
                placeholder={label}
                onChange={(e) => this.handelTargetChange(e, onChange, field.name, editId)}
                onBlur={(e) => this.handelBlur(e, onBlur, field.name, editId)}
                {...option}
              />
            </Form.Item>
            {option.template}
          </Input.Group>
        );
        break;
      case 'select':
      case 'select_multi':
        const multiple = type === 'select_multi';
        // 多选
        if (dataDisplayType === 2) {
          temp = (
            <Form.Item
              name={code}
              {...field}
              rules={[
                {
                  required: !!required,
                  message: '请选择' + label,
                },
              ]}
              className="ww-select-temp"
              noStyle
            >
              <TreeSelect
                onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
                autoClearSearchValue={false}
                maxTagCount={5}
                style={{ width: width ? width : '100%', ...style }}
                showArrow={true}
                allowClear={!!!required || !!multiple}
                dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                treeData={dict}
                placeholder={'请选择'}
                {...option}
              />
            </Form.Item>
          );
        } else if (dataDisplayType === 3) {
          // 特殊，只给图标选择使用
          temp = (
            <Form.Item
              name={code}
              {...field}
              rules={[
                {
                  required: !!required,
                  message: '请选择' + label,
                },
              ]}
              className="ww-select-temp"
              noStyle
            >
              <Select
                onChange={(e) => this.handelValueChange(e, onChange, field.name, editId)}
                showSearch
                autoClearSearchValue={false}
                allowClear={!!!required}
                maxTagCount={5}
                showArrow={true}
                defaultActiveFirstOption={false}
                mode={multiple ? 'multiple' : null}
                placeholder={'请选择'}
                popupClassName="ww-select-wrap"
                filterOption={(inputValue, option) => {
                  const value = String(option.props.value);
                  return value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                }}
                style={{ width: width ? width : '100%', ...style }}
                {...option}
              >
                {dict.map((item, index) => {
                  return (
                    <Select.Option
                      value={item}
                      key={item}
                      style={{ width: '25%', display: 'inline-block' }}
                    >
                      <Row>
                        <Col style={{ textAlign: 'center' }}>
                          <LegacyIcon type={item} style={{ fontSize: '14px' }} />
                          <br />
                          <span>{item}</span>
                        </Col>
                      </Row>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          );
        } else {
          let dropdownRenderContent;
          if (refresh === 1 && dict.length === 0) {
            dropdownRenderContent = (
              <div className="tc" style={{ padding: '8px 0 0' }}>
                <Button className="m10-r" onClick={() => onRefresh()} size="small">
                  刷新
                </Button>
                <Divider style={{ margin: '8px 0' }} />
              </div>
            );
          } else if (dropdownRenderContentFlase) {
            dropdownRenderContent = dropdownRenderContentItem;
          } else {
            dropdownRenderContent =
              !!multiple && dict.length > 0 ? (
                <div className="tc" style={{ padding: '8px 0 0' }}>
                  <Button
                    className="m10-r"
                    onClick={() => this.handelSelectAll(true, item, onChange, field.name, editId)}
                    size="small"
                  >
                    全选列表
                  </Button>
                  <Button
                    className="m10-l"
                    onClick={() => this.handelSelectAll(false, item, onChange, field.name, editId)}
                    size="small"
                  >
                    取消全选
                  </Button>
                  <Divider style={{ margin: '8px 0' }} />
                </div>
              ) : null;
          }
          temp = (
            <Form.Item
              name={code}
              {...field}
              rules={[
                {
                  required: required,
                  message: '请选择' + label,
                },
              ]}
              noStyle
            >
              <Select
                onChange={(e, selectChilds) =>
                  this.handelValueChange(e, onChange, field.name, editId, selectChilds)
                }
                showSearch
                // showSearch={!!dict && dict.length > 5}
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
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    {dropdownRenderContent}
                    {menu}
                  </div>
                )}
                style={{ width: width ? width : '100%' }}
                {...option}
              >
                {_.isArray(dict)
                  ? dict.map((item, index) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : dict(field.name, editId).map((item, index) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
              </Select>
            </Form.Item>
          );
        }
        break;
      case 'autoComplete':
        const newDict = [];
        console.log(
          '***********************dict***********************',
          _.isArray(dict) ? dict : dict()
        );
        // eslint-disable-next-line no-lone-blocks
        {
          _.isArray(dict)
            ? dict.forEach((item) => {
                newDict.push({
                  label: item.name,
                  value: item.id,
                });
              })
            : dict().forEach((item) => {
                newDict.push({
                  label: item.name,
                  value: item.id,
                });
              });
        }
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                required: required,
                message: '请选择' + label,
              },
            ]}
            noStyle
          >
            <AutoComplete
              options={newDict}
              filterOption={(inputValue, option) => {
                const value = String(option.value);
                return value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
              }}
            />
          </Form.Item>
        );
        break;
      case 'upload':
        temp = (
          <Form.Item
            name={code}
            {...field}
            rules={[
              {
                required: !!required,
                message: '请选择' + label,
              },
            ]}
            noStyle
            valuePropName="fileList"
            getValueFromEvent={
              option.multiple
                ? ({ fileList }) => {
                    return fileList;
                  }
                : this.normFile
            }
          >
            <Upload
              onPreview={(file) => this.downloadFile(file)}
              onRemove={() => true}
              listType={'text'}
              {...option}
            >
              <Button>
                <UploadOutlined />
                请选择
              </Button>
            </Upload>
          </Form.Item>
        );
        break;
      case 'transfer':
        temp = (
          <Form.Item
            name={code}
            noStyle
            rules={[{ required: !!required, message: '请选择' + label }]}
          >
            <Transfer render={(item) => item.title} {...option} />
          </Form.Item>
        );
        break;
      case 'table':
        temp = (
          <Form.Item
            name={code}
            noStyle
            rules={[{ required: !!required, message: '请选择' + label }]}
          >
            <Table
              // columns={option.tableColumns}
              rowKey={'key'}
              indentSize={15}
              pagination={false}
              {...option}
            />
          </Form.Item>
        );
        break;
      case 'template':
        temp = (
          <Form.Item
            name={code}
            rules={[]}
            noStyle
            style={{ display: option.display || 'block', ...style }}
          >
            {typeof option.template === 'function'
              ? option.template(field.name, editId)
              : option.template}
          </Form.Item>
        );
        break;
      default:
        temp = null;
    }
    if (shouldUpdate) {
      //   console.log('temp', temp);
      const { shouldUpdate, ...itemS } = item;
      temp = (
        <Form.Item noStyle shouldUpdate={shouldUpdate}>
          {() => this.itemComponents(itemS)}
        </Form.Item>
      );
    }
    return temp;
  };
  render() {
    const {
      labelCol,
      wrapperCol,
      offset,
      groupValue,
      groupListValue,
      editGroupListValue,
      openListLabel,
      openLisEdittLabel,
    } = this.props;
    const option = {};
    const { listName, listRules, wrapCardName, wrapCardCopy, wrapCardMove } = this.props;
    const fields = this.props.fields || [];
    const list = this.props.list || [];
    const WrapCard = this.props.WrapCard || wrapCardComponent;
    const wrapCardAction = this.props.wrapCardAction || this.wrapCardAction;
    const Sortable = wrapCardMove ? ReactSortable : sortableNull;
    const reSortGroup = this.props.reSortGroup || function () {};
    const reSortEditGroup = this.props.reSortEditGroup || function () {};
    // 默认布局
    const formItemLayout = option.vertical
      ? {}
      : {
          labelCol: {
            sm: { span: labelCol === undefined ? 6 : labelCol },
          },
          wrapperCol: {
            sm: { span: wrapperCol || 18 },
            offset,
          },
        };
    return (fields && fields.length > 0) || (list && list.length > 0) ? (
      <>
        {fields.map((item) => {
          if (item.group) {
            let itemGroup = item.group;
            if (typeof item.group === 'string') {
              itemGroup = [item.group];
            }
            const interGroup = _.intersectionWith(groupValue, itemGroup, _.isEqual);
            if (groupValue.length === 0 || interGroup.length <= 0) {
              return null;
            }
          }
          return (
            <IsRowLayout key={item.code} isrow={item.isrow || false}>
              <Col span={item.span || 24} key={item.code} {...item.resLayout}>
                <Form.Item
                  label={item.label}
                  labelCol={
                    item.vertical
                      ? { span: 24 }
                      : item.labelCol
                      ? { span: item.labelCol }
                      : formItemLayout.labelCol
                  }
                  wrapperCol={
                    item.vertical
                      ? { span: 24 }
                      : item.wrapperCol
                      ? { span: item.wrapperCol }
                      : formItemLayout.wrapperCol
                  }
                  required={!!item.required}
                >
                  {this.itemComponents(item)}
                  {item.extra ? item.extra : null}
                </Form.Item>
              </Col>
            </IsRowLayout>
          );
        })}

        {list && list.length > 0 ? (
          <Form.List name={listName} rules={listRules}>
            {(fields, { add, move, remove }, { errors }) => {
              return (
                <Sortable
                  list={fields}
                  setList={(newState) => {
                    const chosen = newState.filter((i) => i.chosen !== undefined);
                    const chosenIndex = newState.findIndex((i) => i.chosen !== undefined);
                    let choseName = false;
                    if (chosen.length > 0) {
                      choseName = chosen[0].name;
                    }
                    if (choseName !== false && chosenIndex !== choseName) {
                      reSortGroup('tragger', choseName, chosenIndex);
                      move(choseName, chosenIndex);
                    }
                  }}
                >
                  {fields.map((field, index) => {
                    let editList = this.props.editList;
                    let editName = _.isArray(this.props.editName)
                      ? this.props.editName
                      : [this.props.editName];
                    let extraDelete = false;
                    const wrapCardNameSingleValue = this.formRef.current?.getFieldValue(listName);
                    const wrapCardNameSingle =
                      wrapCardNameSingleValue && wrapCardNameSingleValue.length > 0
                        ? wrapCardNameSingleValue[field.name]?.wrapCardName
                        : '';
                    return (
                      <WrapCard
                        key={field.key}
                        wrapCardName={wrapCardNameSingle || wrapCardName}
                        wrapCardCopy={wrapCardCopy}
                        wrapCardMove={wrapCardMove}
                        wrapCardAction={wrapCardAction(field)}
                        data={field}
                        datas={fields}
                        remove={() => {
                          reSortGroup('delete', field.name);
                          remove(field.name);
                        }}
                        copy={() => {
                          const fieldValue = this.formRef.current.getFieldValue(listName);
                          return add(fieldValue[field.name]);
                        }}
                        upMove={() => {
                          if (field.name !== 0) {
                            reSortGroup('move', field.name, field.name - 1);
                            return move(field.name, field.name - 1);
                          }
                        }}
                        downMove={() => {
                          if (field.name !== fields.length - 1) {
                            reSortGroup('move', field.name, field.name + 1);
                            move(field.name, field.name + 1);
                          }
                        }}
                        listCurLength={index}
                      >
                        {/* remove所有组的数据 增加当前组的数据 */}
                        <Row type="flex" justify="start" gutter={12} style={{ width: '100%' }}>
                          {list.map((item) => {
                            if (!_.isObject(item)) {
                              console.error('list的每一项不是对象');
                            }
                            if (
                              item.editId === undefined ||
                              (item.editId === field.name && !item.editList && !item.group)
                            ) {
                              if (item.group) {
                                //   console.log('field.name ', field.name, groupListValue);
                                let itemGroup = item.group;
                                if (typeof item.group === 'string') {
                                  itemGroup = [item.group];
                                }
                                let interGroup = [];
                                //   通过groupListValue 判断当前组是否要有组联动，通过每一项的第一个字段对应
                                const groupListDefaultValue = groupListValue[0][1];
                                for (let grId = 0; grId < groupListValue.length; grId++) {
                                  const gr = groupListValue[grId];
                                  if (field.name === gr[0]) {
                                    interGroup = _.intersectionWith(gr[1], itemGroup, _.isEqual);
                                    break;
                                  } else {
                                    interGroup = _.intersectionWith(
                                      groupListDefaultValue,
                                      itemGroup,
                                      _.isEqual
                                    );
                                  }
                                }

                                //   console.log('interGroup', interGroup);
                                if (interGroup.length <= 0) {
                                  return null;
                                }
                              }
                              const codeNew = _.isArray(item.code) ? item.code : [item.code];
                              return (
                                <Col
                                  span={item.span || 24}
                                  key={field.key + item.code}
                                  {...item.resLayout}
                                >
                                  <Form.Item
                                    label={!openListLabel && index > 0 ? '' : item.label}
                                    labelCol={
                                      item.vertical ? 24 : item.labelCol || formItemLayout.labelCol
                                    }
                                    wrapperCol={
                                      item.vertical
                                        ? 24
                                        : item.wrapperCol || formItemLayout.wrapperCol
                                    }
                                    required={!!item.required}
                                  >
                                    {this.itemComponents(item, {
                                      ...field,
                                      name: [field.name, ...codeNew],
                                    })}
                                    {item.extra ? item.extra : null}
                                  </Form.Item>
                                </Col>
                              );
                            } else if (item.editList) {
                              //   editId = item.editId;
                              //   editIndex = item.editIndex;
                              //   editList = item.editList;
                              //   editName = item.editName;
                              //   console.log('item.editName', item.editName);
                              //   extraDelete = item.extraDelete;
                            } else {
                              return null;
                            }
                          })}

                          {/* 嵌套项 */}
                          {editName ? (
                            <Form.List name={[field.name, ...editName]} key={field.key}>
                              {(editFields, { add: addEdit, remove: removeEdit }, { errors }) => {
                                return editFields.map((editField, editFieldIndex) => {
                                  //   console.log('editField', editField);
                                  return (
                                    <React.Fragment key={editField.key}>
                                      {editList.map((editItem) => {
                                        if (editItem.group) {
                                          let itemGroup = editItem.group;
                                          if (typeof editItem.group === 'string') {
                                            itemGroup = [editItem.group];
                                          }
                                          let interGroup = [];
                                          for (
                                            let grId = 0;
                                            grId < editGroupListValue.length;
                                            grId++
                                          ) {
                                            const gr = editGroupListValue[grId];
                                            if (field.name === gr[0] && editField.name === gr[1]) {
                                              interGroup = _.intersectionWith(
                                                gr[2],
                                                itemGroup,
                                                _.isEqual
                                              );
                                              break;
                                            }
                                          }

                                          //   console.log('interGroup', interGroup);
                                          if (interGroup.length <= 0) {
                                            return null;
                                          }
                                        }
                                        const codeNew = _.isArray(editItem.code)
                                          ? editItem.code
                                          : [editItem.code];
                                        return (
                                          <Col
                                            span={editItem.span || 24}
                                            key={editField.key + editItem.code}
                                            {...editItem.resLayout}
                                          >
                                            <Form.Item
                                              label={
                                                !openLisEdittLabel && editFieldIndex > 0
                                                  ? ''
                                                  : editItem.label
                                              }
                                              labelCol={
                                                editItem.vertical
                                                  ? 24
                                                  : editItem.labelCol || formItemLayout.labelCol
                                              }
                                              wrapperCol={
                                                editItem.vertical
                                                  ? 24
                                                  : editItem.wrapperCol || formItemLayout.wrapperCol
                                              }
                                              required={!!editItem.required}
                                            >
                                              {this.itemComponents(
                                                { editId: field.name, ...editItem },
                                                {
                                                  ...editField,
                                                  name: [editField.name, ...codeNew],
                                                }
                                              )}
                                              {editItem.extra ? editItem.extra : null}
                                            </Form.Item>
                                          </Col>
                                        );
                                      })}
                                      {extraDelete ? null : (
                                        <Col
                                          span={1}
                                          className={
                                            editField.name === 0 || openLisEdittLabel
                                              ? 'flex-cc'
                                              : 'flex-cs'
                                          }
                                        >
                                          <MinusCircleOutlined
                                            style={{ color: '#F1416C' }}
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                              reSortEditGroup('delete', field.name, editField.name);
                                              removeEdit(editField.name);
                                            }}
                                          />
                                        </Col>
                                      )}
                                    </React.Fragment>
                                  );
                                });
                              }}
                            </Form.List>
                          ) : null}
                        </Row>
                      </WrapCard>
                    );
                  })}
                </Sortable>
              );
            }}
          </Form.List>
        ) : null}
      </>
    ) : null;
  }
}

export default React.forwardRef((props, ref) => {
  return <FormItemTemp {...props} forwardedref={ref.current ? ref : { current: ref }} />;
});
