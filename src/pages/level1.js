import React from 'react';
import { connect } from 'dva';
import { Form, Button, Divider } from 'antd';
import FormItem, { FormWrapCard, addLevel1 } from '@/components/FormItem';
import Level1Simple from './components/level1Simple';
const Level1Index = (props) => {
  const [form] = Form.useForm();
  const addHandle = () => {
    addLevel1(form, ['list'], {});
  };
  return (
    <>
      <Divider orientation="left">好看的包裹器</Divider>
      <Form form={form} layout="vertical" initialValues={{}}>
        <FormItem
          ref={form}
          fields={[
            {
              type: 'text',
              required: true,
              label: '标题',
              code: 'title',
              span: 24,
            },
          ]}
          level1={{
            name: ['list'],
            fields: [
              {
                type: 'text',
                label: '键',
                code: 'key',
                span: 12,
              },
              {
                type: 'text',
                label: '值',
                code: 'value',
                span: 12,
              },
            ],
            WrapComponent: FormWrapCard,
            wrapCopy: true,
            wrapMove: true,
            openLabel: true,
          }}
          labelCol={24}
          wrapperCol={24}
        ></FormItem>
      </Form>
      <Button onClick={addHandle}> 添加一项</Button>
      <Divider orientation="left">没有包裹器</Divider>
      <Level1Simple></Level1Simple>
    </>
  );
};
export default connect()(Level1Index);
