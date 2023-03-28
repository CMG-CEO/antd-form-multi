import React, { Component } from 'react';
import { Card, Space, Row, Divider, Col } from 'antd';
import {
  UpOutlined,
  DownOutlined,
  CopyOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import styles from './index.less';

/**
 * 一个好看的FormList包裹器
 * wrapCardName 名称
 * wrapCardCopy 快捷复制一项的操作按钮
 * wrapCardMove 快捷删除一项的操作按钮
 * wrapCardAction 额外需要自定义的操作按钮
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
        <Row type="flex" gutter={[12]} justify="start" align="middle">
          {this.props.children}
        </Row>
      </Card>
    );
  }
}
export default FormWrapCard;

/**
 *
 * 一个空的组件
 */
export const wrapComponentLevel1 = (props) => {
  return <>{props.children}</>;
};

/**
 *
 * 一个带删除的二级列表组件
 */

export const wrapComponentLevel2 = (props) => {
  return (
    <>
      {props.children}
      <Col span={1}>
        <MinusCircleOutlined style={{ color: '#F1416C' }} onClick={props.remove} />
      </Col>
    </>
  );
};
/**
 *
 * 一个最啥也没有的的的标签组件
 */
export const sortableNull = (props) => {
  return <>{props.children}</>;
};
