import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Button, Divider } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import FormItem, { FormWrapCard, addLevel1, addLevel2 } from '@/components/FormItem';

const Level2Index = (props) => {
  const [form] = Form.useForm();
  const addHandle = () => {
    addLevel1(form, ['list'], {});
  };
  const addHandleLevel2 = (field) => {
    const name = ['level2'];
    // 新增第二级的List
    addLevel2(form, ['list', field.name], name, {});
  };
  return (
    <>
      <Divider orientation="left">表单二级</Divider>
      <Form form={form} layout="vertical" initialValues={{}}>
        <FormItem
          ref={form}
          level1={{
            name: ['list'],
            fields: [
              {
                type: 'text',
                label: '我是Level1',
                code: 'level1',
                span: 24,
              },
            ],
            WrapComponent: FormWrapCard,
            openLabel: true,
            wrapAction: (data) => <PlusCircleOutlined onClick={() => addHandleLevel2(data)} />,
          }}
          level2={{
            name: ['level2'],
            fields: [
              {
                type: 'text',
                label: '我是Level2',
                code: 'level1',
                span: 10,
              },
            ],
            openLabel: true,
          }}
          labelCol={24}
          wrapperCol={24}
        ></FormItem>
      </Form>
      <Button onClick={addHandle}> 添加一项</Button>
    </>
  );
};
export default connect()(Level2Index);
