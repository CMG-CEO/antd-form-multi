import React from 'react';
import { connect } from 'dva';
import { ConfigProvider, Layout, Menu } from 'antd';
import { Redirect, history } from 'umi';
import styles from './index.less';
const { Content, Header, Sider } = Layout;

const menuNew = [
  {
    label: '基础用法',
    key: 'base',
  },
  {
    label: '数据联动',
    key: 'dataLink',
  },
  {
    label: '一级列表',
    key: 'level1',
  },
  {
    label: '一级列表-联动',
    key: 'dataLinkLevel1',
  },
  {
    label: '二级列表',
    key: 'level2',
  },
  {
    label: '二级列表-联动',
    key: 'dataLinkLevel2',
  },
];
const handleMenu = ({ key }) => {
  history.push(`${key}`);
};
const BaseLayout = (props) => {
  if (props.location.pathname === '' || props.location.pathname === '/') {
    return <Redirect to="/base" />;
  }
  return (
    <ConfigProvider>
      <Layout style={{ height: '100%' }}>
        <div className={styles.layout}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['base']}
            items={menuNew}
            onClick={handleMenu}
            style={{
              width: 256,
            }}
          ></Menu>
          <Content id="primaryLayout">
            <div style={{ padding: '12px' }}>{props.children}</div>
          </Content>
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default connect()(BaseLayout);
