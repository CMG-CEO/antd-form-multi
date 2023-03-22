import React, { Component } from 'react';
import { Row, Col, Card, Button, Space, Divider } from 'antd';
import {
  UpOutlined,
  DownOutlined,
  CopyOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import styles from './index.less';

/**
 * 一个好看的FormList包裹器
 */
class FormWrapCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { wrapCardCopy, wrapCardMove, wrapCardAction, data } = this.props;
    const wrapCardName = this.props.wrapCardName || '新的标签页';
    return (
      //   <Row type="flex" align="middle" gutter={12} style={{ width: '100%' }}>
      <Card
        title={`#${data.name + 1}.${wrapCardName}`}
        headStyle={{ backgroundColor: '#F6F7F9' }}
        className={styles.formWrapCard}
        extra={
          <Space align="start">
            {wrapCardAction}
            {wrapCardCopy ? <CopyOutlined onClick={this.props.copy} /> : null}

            <DeleteOutlined onClick={this.props.remove} />
            {wrapCardMove ? (
              <>
                <UpOutlined onClick={this.props.upMove} />
                <DownOutlined onClick={this.props.downMove} />
              </>
            ) : null}
          </Space>
        }
      >
        {this.props.children}
      </Card>
      //   </Row>
    );
  }
}
export default FormWrapCard;

/**
 *
 * @param {Form的ref} WFormRef
 * @param {FormList的名称 数组类型} listName
 * @param {添加的默认值} defaultValue
 * @param {*按钮名，默认} btnName
 * @param {*antd Button的其余配置项} option
 * @returns
 */
export const AddFormListBtn = (WFormRef, listName, defaultValue, btnName = '增加', option) => {
  return (
    <Button onClick={() => handleAddFormListItem(WFormRef, listName, defaultValue)} {...option}>
      {btnName}
    </Button>
  );
};
//   增加一项增加一个FormList 的处理函数，也可单独使用
/**
 *
 * @param {Form的ref} WFormRef
 * @param {FormList的名称 数组类型} listName
 * @param {添加的默认值} defaultValue
 */
export const handleAddFormListItem = (WFormRef, listName, defaultValue = null) => {
  const list = WFormRef.current.getFieldValue(listName) || []; 
  const nextList = defaultValue ? list.concat(defaultValue) : list;
  const str = listName.join('.');
  const obj = _.zipObjectDeep([str], [nextList]);
  console.log('obj', list, nextList, obj);
  //   debugger;
  WFormRef.current.setFieldsValue({
    ...obj,
  });
};

// 增加Form.List里面的一项
/**
 *
 * @param {Form的ref} WFormRef
 * @param {FormList的名称 数组类型} listName
 * @param {FormList内嵌的List名称} editName
 * @param {默认值} defaultValue
 * @param {回调，增加校验使用} callback
 */
export const handleFormListItem = (WFormRef, listName, editName, defaultValue = {}, callback) => {
  let curData = WFormRef.current.getFieldValue(listName) || {};
  // 支持数组和字符串形式
  if (_.isArray(editName)) {
    let data = WFormRef.current.getFieldValue([...listName, ...editName]);
    if (data) {
      data.push(defaultValue);
      const str = editName.join('.');
      const obj = _.zipObjectDeep([str], [data]); 
      // curData[editName]
      _.merge(curData, obj); 
    } else {
      const str = editName.join('.');
      const obj = _.zipObjectDeep([str], [[defaultValue]]);
      _.merge(curData, obj); 
    }
  } else {
    if (curData[editName]) {
      curData[editName].push(defaultValue);
    } else {
      curData[editName] = [defaultValue];
    }
  }

  if (typeof callback === 'function') {
    const res = callback(curData);
    if (!res) {
      return;
    }
  }
  console.log('curData', curData);
  WFormRef.current.setFieldsValue({
    ...curData,
  });
};
/**
 *
 * 一个最基本的的标签组件
 */
export const wrapCardComponent = (props) => {
  return (
    <Row type="flex" align="middle" gutter={12}>
      {props.children}
      <Divider className="m15-tb"></Divider>
    </Row>
  );
};
/**
 *
 * 一个最啥也没有的的的标签组件
 */
export const sortableNull = (props) => {
  return <>{props.children}</>;
};

/**
 * 对拖拽移动后组的校验规则进行重排
 * @param {*Form的ref} WFormRef
 * @param {*组控制列表} groupListValue
 * @param {*判断是删除、移动还是拖拽} type
 * @param {*起始的name} name
 * @param {*终止name} afterName
 * @returns
 */
export const reSortGroup = (WFormRef, groupListValue, type, name, afterName) => {
  const list = WFormRef.current.getFieldValue(['disks']);
  console.log('list', groupListValue, name, list);
  if (type === 'delete') {
    _.remove(groupListValue, (i) => i[0] === name);
    groupListValue.forEach((i, index) => {
      if (index > 0) {
        i[0] = index - 1;
      }
    });
  } else if (type === 'move') {
    //   console.log('name, afterName', name, afterName);
    [groupListValue[afterName + 1][1], groupListValue[name + 1][1]] = [
      groupListValue[name + 1][1],
      groupListValue[afterName + 1][1],
    ];
  } else if (type === 'tragger') {
    //   console.log('name, afterName', name, afterName);
    const newValue = _.remove(groupListValue, (i) => i[0] === name);
    groupListValue.splice(afterName + 1, 0, ...newValue);
    groupListValue.forEach((i, index) => {
      if (index > 0) {
        i[0] = index - 1;
      }
    });
  }

  return groupListValue;
};

export class FormWrapCardSimple extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data, wrapCardName } = this.props;
    return data.name === 0 ? (
      <>
        <Col span={8}></Col>
        <Col span={8}>
          <Card
            title={`${data.name + 1}.${wrapCardName}`}
            headStyle={{ backgroundColor: '#F6F7F9' }}
            className={styles.formWrapSimpleCard}
            bodyStyle={{ paddingTop: 0 }}
            extra={
              <Space align="start">
                <DeleteOutlined onClick={this.props.remove} />
              </Space>
            }
          >
            {this.props.children}
          </Card>
        </Col>
      </>
    ) : (
      <Col span={8}>
        <Card
          title={`${data.name + 1}.${wrapCardName}`}
          headStyle={{ backgroundColor: '#F6F7F9' }}
          className={styles.formWrapSimpleCard}
          bodyStyle={{ paddingTop: 0 }}
          extra={
            <Space align="start">
              <DeleteOutlined onClick={this.props.remove} />
            </Space>
          }
        >
          {this.props.children}
        </Card>
      </Col>
    );
  }
}
export class FormWrapCardLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data, wrapCardName } = this.props;

    return (
      <Col span={8}>
        <Card
          title={`${data.name + 1}.${wrapCardName}`}
          headStyle={{ backgroundColor: '#F6F7F9' }}
          className={styles.formWrapSimpleCard}
          bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          extra={
            <Space align="start">
              <DeleteOutlined onClick={this.props.remove} />
            </Space>
          }
        >
          {this.props.children}
        </Card>
      </Col>
    );
  }
}
export class FormWrapCardLabelMd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data, wrapCardName } = this.props;

    return (
      <Col span={12}>
        <Card
          title={`${data.name + 1}.${wrapCardName}`}
          headStyle={{ backgroundColor: '#F6F7F9' }}
          className={styles.formWrapSimpleCard}
          bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          extra={
            <Space align="start">
              <DeleteOutlined onClick={this.props.remove} />
            </Space>
          }
        >
          {this.props.children}
        </Card>
      </Col>
    );
  }
}
export class FormWrapCardLabelSm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data, wrapCardName } = this.props;

    return (
      <Col span={6}>
        <Card
          title={`${data.name + 1}.${wrapCardName}`}
          headStyle={{ backgroundColor: '#F6F7F9' }}
          className={styles.formWrapSimpleCard}
          bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          extra={
            <Space align="start">
              <DeleteOutlined onClick={this.props.remove} />
            </Space>
          }
        >
          {this.props.children}
        </Card>
      </Col>
    );
  }
}
export const FormWrapTile = (props) => {
  return (
    <Row type="flex" align={props.listCurLength > 0 ? 'top' : 'middle'} style={{ width: '100%' }}>
      <Col span={23}>{props.children}</Col>
      <Col span={1}>
        <MinusCircleOutlined style={{ color: '#F1416C' }} onClick={props.remove} />
      </Col>
    </Row>
  );
};
