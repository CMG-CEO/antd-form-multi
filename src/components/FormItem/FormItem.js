import React, { PureComponent } from 'react';
import { Form, Col } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import { wrapComponentLevel1, wrapComponentLevel2, sortableNull } from './FormWrapCard';

import { isGroupLevel1, isGroupLevel2 } from './utils/groupValidate';
import reSortGroup, { reSortGroupAll2 } from './utils/reSortGroup';
import { formItemLayoutHandle } from './utils/constants';

import {
  DatePicker,
  Input,
  Radio,
  InputNumber,
  Select,
  Checkbox,
  Switch,
  Transfer,
  Table,
  AutoComplete,
  Template,
} from './utils/modules';

import _ from 'lodash';

class FormItemTemp extends PureComponent {
  formRef = this.props.forwardedref;

  constructor(props) {
    super(props);

    this.state = {};
  }

  handelValueChange = (value, perentFun, self, upLevelname, selectChilds) => {
    if (typeof perentFun === 'function') {
      if (upLevelname !== undefined) {
        perentFun(value, upLevelname, self[0], selectChilds);
      } else {
        perentFun(value, self, selectChilds);
      }
    }
  };

  handelTargetChange = (value, perentFun, self, upLevelname) => {
    if (typeof perentFun === 'function') {
      if (upLevelname !== undefined) {
        perentFun(value.target.value, upLevelname, self[0]);
      } else {
        perentFun(value.target.value, self);
      }
    }
  };

  handelBlur = (value, perentFun, self, upLevelname) => {
    if (typeof perentFun === 'function') {
      if (upLevelname !== undefined) {
        perentFun(value.target.value, upLevelname, self[0]);
      } else {
        perentFun(value.target.value, self);
      }
    }
  };

  handelSelectAll = (isSelectAll, item, onChange, self, upLevelname) => {
    let { options, code } = item;
    if (typeof options === 'function') {
      options = options(self, upLevelname);
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
        values = (options || []).map((item) => {
          return item[textValue.value] !== undefined ? item[textValue.value] : item['id'];
        });
      } else {
        values = [];
      }
    } else {
      //如果有搜索，则只选择/反选搜索结果数据
      const searchResult = (options || []).filter((item) => {
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
    setTimeout(() => {
      if (this.formRef?.current) {
        if (upLevelname !== undefined) {
          const nameLevel1 = this.formRef.current.getFieldValue(this.props.level1?.name);
          // 找两级
          nameLevel1[upLevelname][this.props.level2.name][self[0]][self[1]] = obj[self[1]];
          this.formRef.current.setFieldsValue({
            ...nameLevel1,
          });
        } else if (self) {
          const nameLevel1 = this.formRef.current.getFieldValue(this.props.level1?.name);
          // 找一级
          Object.assign(nameLevel1[self[0]], obj);
          this.formRef.current.setFieldsValue({
            ...nameLevel1,
          });
        } else {
          this.formRef.current.setFieldsValue({
            ...obj,
          });
        }
      }
    }, 50);
    this.handelValueChange(values, onChange, self, upLevelname);
  };

  wrapCardAction = () => {
    return <></>;
  };
  handleNewList = (newState, move, level = 'level1', uplevelname) => {
    let { groupValue } = this.props[level];
    const chosen = newState.filter((i) => i.chosen !== undefined);
    const chosenIndex = newState.findIndex((i) => i.chosen !== undefined);
    let choseName = false;
    if (chosen.length > 0) {
      choseName = chosen[0].name;
    }
    if (choseName !== false && chosenIndex !== choseName) {
      reSortGroup(groupValue, 'move', [choseName, uplevelname], chosenIndex);
      move(choseName, chosenIndex);
    }
  };
  handleGroup = (group) => {
    let itemGroup = group;
    if (typeof group === 'string') {
      itemGroup = [group];
    }
    const { groupValue } = this.props;
    const interGroup = _.intersectionWith(groupValue, itemGroup, _.isEqual);
    if (groupValue.length === 0 || interGroup.length <= 0) {
      return null;
    }
    return interGroup;
  };
  handleGroup1 = (group, name) => {
    let itemGroup = group;
    if (typeof group === 'string') {
      itemGroup = [group];
    }
    let interGroup = [];
    let { groupValue: groupValueLevel1 } = this.props.level1;
    if (!isGroupLevel1(groupValueLevel1)) {
      console.error('一级组的格式错误');
    }

    const groupListDefaultValue = groupValueLevel1[0][1];
    for (let grId = 0; grId < groupValueLevel1.length; grId++) {
      const gr = groupValueLevel1[grId];
      if (name === gr[0]) {
        interGroup = _.intersectionWith(gr[1], itemGroup, _.isEqual);
        break;
      } else {
        interGroup = _.intersectionWith(groupListDefaultValue, itemGroup, _.isEqual);
      }
    }
    if (interGroup.length <= 0) {
      return null;
    }
    return interGroup;
  };
  handleGroup2 = (group, nameLevel1, nameLevel2) => {
    let itemGroup = group;
    if (typeof group === 'string') {
      itemGroup = [group];
    }
    let interGroup = [];
    let { groupValue: groupValueLevel2 } = this.props.level2;
    if (!isGroupLevel2(groupValueLevel2)) {
      console.error('二级组的格式错误');
    }
    for (let grId = 0; grId < groupValueLevel2.length; grId++) {
      const gr = groupValueLevel2[grId];
      if (nameLevel1 === gr[0] && nameLevel2 === gr[1]) {
        interGroup = _.intersectionWith(gr[2], itemGroup, _.isEqual);
        break;
      }
    }
    if (interGroup.length <= 0) {
      return null;
    }
    return interGroup;
  };

  wrapRemove = (field, remove, level = 'level1', uplevelname) => {
    let { groupValue: groupLevel1 } = this.props.level1 || {};
    let { groupValue: groupLevel2 } = this.props.level2 || {};

    if (groupLevel1) {
      reSortGroup(groupLevel1, 'delete', [field.name]);
    }
    if (groupLevel2) {
      reSortGroup(groupLevel2, 'delete', [field.name, uplevelname]);
    }
    remove(field.name);
  };

  wrapCopy = (field, add, level = 'level1', uplevelname) => {
    let { groupValue: groupLevel1, name: nameLevel1 } = this.props.level1 || {};
    let { groupValue: groupLevel2, name: nameLevel2 } = this.props.level2 || {};

    if (level === 'level1') {
      const fieldValue = this.formRef.current.getFieldValue(nameLevel1);
      !!groupLevel1 && reSortGroup(groupLevel1, 'add', [field.name], fieldValue.length);
      !!groupLevel2 && reSortGroupAll2(groupLevel2, 'add', [field.name], fieldValue.length);
      add(fieldValue[field.name]);
      this.formRef.current.setFieldValue(
        [...nameLevel1, fieldValue.length],
        fieldValue[field.name]
      );
    }
    if (level === 'level2') {
      const fieldValue = this.formRef.current.getFieldValue([
        ...nameLevel1,
        uplevelname,
        ...nameLevel2,
      ]);

      reSortGroup(groupLevel2, 'add', [field.name, uplevelname], fieldValue.length);
      add(fieldValue[field.name]);
      this.formRef.current.setFieldValue(
        [...nameLevel1, uplevelname, ...nameLevel2, fieldValue.length],
        fieldValue[field.name]
      );
    }
  };
  wrapUpMove = (field, move, level = 'level1', uplevelname) => {
    let { groupValue: groupLevel1 } = this.props.level1 || {};
    let { groupValue: groupLevel2 } = this.props.level2 || {};
    if (field.name !== 0) {
      if (level === 'level1') {
        !!groupLevel1 && reSortGroup(groupLevel1, 'move', [field.name], field.name - 1);
        !!groupLevel2 && reSortGroupAll2(groupLevel2, 'move', [field.name], field.name - 1);
      }
      if (level === 'level2') {
        reSortGroup(groupLevel2, 'move', [field.name, uplevelname], field.name - 1);
      }
      move(field.name, field.name - 1);
    }
  };
  wrapDownMove = (field, move, level = 'level1', uplevelname, fields) => {
    let { groupValue: groupLevel1 } = this.props.level1 || {};
    let { groupValue: groupLevel2 } = this.props.level2 || {};
    if (field.name !== fields.length - 1) {
      if (level === 'level1') {
        !!groupLevel1 && reSortGroup(groupLevel1, 'move', [field.name], field.name + 1);
        !!groupLevel2 && reSortGroupAll2(groupLevel2, 'move', [field.name], field.name + 1);
      }
      if (level === 'level2') {
        reSortGroup(groupLevel2, 'move', [field.name, uplevelname], field.name + 1);
      }
      move(field.name, field.name + 1);
    }
  };
  itemComponents = (item, field = {}) => {
    let temp = null;
    const plugin = this.props || [];
    for (let index = 0; index < plugin.length; index += 1) {
      const element = plugin[index];
      if (element.type === item.type) {
        temp = element.component(item,field);
        return;
      }
    }

    switch (item.type) {
      case 'datePicker':
      case 'rangePicker':
        temp = (
          <DatePicker
            item={item}
            field={field}
            handelValueChange={this.handelValueChange}
          ></DatePicker>
        );
        break;
      case 'timePicker':
      case 'timeRangePicker':
        temp = (
          <DatePicker
            item={item}
            field={field}
            handelValueChange={this.handelValueChange}
          ></DatePicker>
        );
        break;
      case 'switch':
        temp = <Switch item={item} field={field} handelValueChange={this.handelValueChange} />;
        break;
      case 'radio_button':
      case 'radio':
        // direction 垂直水平方向
        temp = (
          <Radio item={item} field={field} handelTargetChange={this.handelTargetChange}></Radio>
        );
        break;
      case 'checkbox':
        temp = (
          <Checkbox item={item} field={field} handelValueChange={this.handelValueChange}></Checkbox>
        );
        break;
      case 'text':
      case 'password':
      case 'text_group':
      case 'textarea':
        temp = (
          <Input
            item={item}
            field={field}
            handelTargetChange={this.handelTargetChange}
            handelBlur={this.handelBlur}
          ></Input>
        );
        break;
      case 'number_text':
        temp = (
          <InputNumber
            item={item}
            field={field}
            handelTargetChange={this.handelTargetChange}
            handelBlur={this.handelBlur}
          ></InputNumber>
        );
        break;
      case 'select':
      case 'select_multi':
        temp = (
          <Select
            item={item}
            field={field}
            handelSelectAll={this.handelSelectAll}
            handelValueChange={this.handelValueChange}
          ></Select>
        );
        break;
      case 'autoComplete':
        temp = <AutoComplete item={item} field={field} />;
        break;
      case 'upload':
        temp = <Transfer item={item} field={field} />;
        break;
      case 'transfer':
        temp = <Transfer item={item} />;
        break;
      case 'table':
        temp = <Table item={item} />;
        break;
      case 'template':
        temp = <Template item={item} field={field} />;
        break;
      default:
        temp = null;
    }
    return temp;
  };

  render() {
    const { labelCol, wrapperCol, offset } = this.props;
    const fields = this.props.fields || [];
    let {
      fields: fieldsLevel1,
      name: nameLevel1,
      rules: rulesLevel1,
      WrapComponent: WrapLevel1,
      openLabel: openLabelLevel1,
      labelCol: labelColLevel1,
      offset: offsetLevel1,
      wrapperCol: wrapperColLevel1,
      wrapAction: wrapActionLevel1,
      wrapName: wrapNamelevel1,
      wrapCopy: wrapCopylevel1,
      wrapMove: wrapMovelevel1,
      sortable: wrapSortable1,
    } = this.props.level1 || {};

    let {
      fields: fieldsLevel2,
      name: nameLevel2,
      rules: rulesLevel2,
      WrapComponent: WrapLevel2,
      openLabel: openLabelLevel2,
      labelCol: labelColLevel2,
      wrapperCol: wrapperColLevel2,
      offset: offsetLevel2,
      wrapAction: wrapActionLevel2,
      wrapName: wrapNamelevel2,
      wrapCopy: wrapCopylevel2,
      wrapMove: wrapMovelevel2,
    } = this.props.level2 || {};

    nameLevel1 = _.isArray(nameLevel1) ? nameLevel1 : [nameLevel1];
    WrapLevel1 = WrapLevel1 || wrapComponentLevel1;
    wrapActionLevel1 = wrapActionLevel1 || this.wrapCardAction;

    nameLevel2 = nameLevel2 ? (_.isArray(nameLevel2) ? nameLevel2 : [nameLevel2]) : '';
    WrapLevel2 = WrapLevel2 || wrapComponentLevel2;
    wrapActionLevel2 = wrapActionLevel2 || this.wrapCardAction;

    const Sortable = wrapSortable1 ? ReactSortable : sortableNull;

    // 默认布局
    const formItemLayout = formItemLayoutHandle(labelCol, wrapperCol, offset);
    const formItemLayoutLevel1 = formItemLayoutHandle(
      labelColLevel1,
      wrapperColLevel1,
      offsetLevel1
    );
    const formItemLayoutLevel2 = formItemLayoutHandle(
      labelColLevel2,
      wrapperColLevel2,
      offsetLevel2
    );

    return (fields && fields.length > 0) || (fieldsLevel1 && fieldsLevel1.length > 0) ? (
      <>
        {fields.map((item) => {
          if (item.group) {
            if (!this.handleGroup(item.group)) {
              return null;
            }
          }
          return (
            <Col span={item.span || 24} key={item.code} {...item.resLayout}>
              <Form.Item
                label={item.label}
                labelCol={item.labelCol ? { span: item.labelCol } : formItemLayout.labelCol}
                wrapperCol={item.wrapperCol ? { span: item.wrapperCol } : formItemLayout.wrapperCol}
                required={!!item.required}
              >
                {this.itemComponents(item)}
              </Form.Item>
            </Col>
          );
        })}
        {fieldsLevel1 && fieldsLevel1.length > 0 ? (
          <Form.List name={nameLevel1} rules={rulesLevel1}>
            {(fields, { add, move, remove }, { errors }) => {
              return (
                <Sortable list={fields} setList={(newState) => this.handleNewList(newState, move)}>
                  {fields.map((field, index) => {
                    return (
                      <WrapLevel1
                        key={field.key}
                        wrapCardName={wrapNamelevel1}
                        // wrapCardName={wrapCardNameSingle || wrapCardName}
                        wrapCardCopy={wrapCopylevel1}
                        wrapCardMove={wrapMovelevel1}
                        wrapCardAction={wrapActionLevel1(field)}
                        data={field}
                        datas={fields}
                        remove={() => this.wrapRemove(field, remove)}
                        copy={() => this.wrapCopy(field, add)}
                        upMove={() => this.wrapUpMove(field, move)}
                        downMove={() => this.wrapDownMove(field, move, 'level1', null, fields)}
                      >
                        {fieldsLevel1.map((item) => {
                          // 判断 每一项的组是否有在 规则内 有则渲染，没有则不渲染
                          if (item.group) {
                            if (!this.handleGroup1(item.group, field.name)) {
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
                                label={!openLabelLevel1 && index > 0 ? '' : item.label}
                                labelCol={
                                  item.labelCol
                                    ? { span: item.labelCol }
                                    : formItemLayoutLevel1.labelCol
                                }
                                wrapperCol={
                                  item.wrapperCol
                                    ? { span: item.wrapperCol }
                                    : formItemLayoutLevel1.wrapperCol
                                }
                                required={!!item.required}
                              >
                                {this.itemComponents(item, {
                                  ...field,
                                  name: [field.name, ...codeNew],
                                })}
                              </Form.Item>
                            </Col>
                          );
                        })}

                        {/* 第二级嵌套项 */}
                        {nameLevel2 ? (
                          <Form.List
                            name={[field.name, ...nameLevel2]}
                            rules={rulesLevel2}
                            key={field.key}
                          >
                            {(
                              _fieldsLevel2,
                              { add: add2, remove: remove2, move: move2 },
                              { errors }
                            ) => {
                              return _fieldsLevel2.map((_fieldLevel2, _fieldLevel2Index) => {
                                return (
                                  <WrapLevel2
                                    key={_fieldLevel2.key}
                                    wrapCardName={wrapNamelevel2}
                                    wrapCardCopy={wrapCopylevel2}
                                    wrapCardMove={wrapMovelevel2}
                                    wrapCardAction={wrapActionLevel2(_fieldLevel2)}
                                    data={_fieldLevel2}
                                    datas={_fieldsLevel2}
                                    remove={() =>
                                      this.wrapRemove(_fieldLevel2, remove2, 'level2', field.name)
                                    }
                                    copy={() =>
                                      this.wrapCopy(_fieldLevel2, add2, 'level2', field.name)
                                    }
                                    upMove={() =>
                                      this.wrapUpMove(_fieldLevel2, move2, 'level2', field.name)
                                    }
                                    downMove={() =>
                                      this.wrapDownMove(
                                        _fieldLevel2,
                                        move2,
                                        'level2',
                                        field.name,
                                        _fieldsLevel2
                                      )
                                    }
                                  >
                                    {fieldsLevel2.map((_fl2Item) => {
                                      if (_fl2Item.group) {
                                        if (
                                          !this.handleGroup2(
                                            _fl2Item.group,
                                            field.name,
                                            _fieldLevel2.name
                                          )
                                        ) {
                                          return null;
                                        }
                                      }
                                      const codeNew = _.isArray(_fl2Item.code)
                                        ? _fl2Item.code
                                        : [_fl2Item.code];
                                      return (
                                        <Col
                                          span={_fl2Item.span || 24}
                                          key={_fieldLevel2.key + _fl2Item.code}
                                          {..._fl2Item.resLayout}
                                        >
                                          <Form.Item
                                            label={
                                              !openLabelLevel2 && _fieldLevel2Index > 0
                                                ? ''
                                                : _fl2Item.label
                                            }
                                            labelCol={
                                              _fl2Item.labelCol
                                                ? { span: _fl2Item.labelCol }
                                                : formItemLayoutLevel2.labelCol
                                            }
                                            wrapperCol={
                                              _fl2Item.wrapperCol
                                                ? { span: _fl2Item.wrapperCol }
                                                : formItemLayoutLevel2.wrapperCol
                                            }
                                            required={!!_fl2Item.required}
                                          >
                                            {this.itemComponents(
                                              { upLevelname: field.name, ..._fl2Item },
                                              {
                                                ..._fieldLevel2,
                                                name: [_fieldLevel2.name, ...codeNew],
                                              }
                                            )}
                                          </Form.Item>
                                        </Col>
                                      );
                                    })}
                                  </WrapLevel2>
                                );
                              });
                            }}
                          </Form.List>
                        ) : null}
                      </WrapLevel1>
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
