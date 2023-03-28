import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row } from 'antd';
import FormItem, { addLevel1 } from '@/components/FormItem';

const FormWrapSimple = (props) => {
  return (
    <Row type="flex" gutter={[12]} justify="start" align="middle">
      {props.children}
    </Row>
  );
};
const Level1SimpleIndex = (props) => {
  const [form] = Form.useForm();
  const addHandle = () => {
    addLevel1(form, ['list'], {});
  };
  return (
    <>
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
            WrapComponent: FormWrapSimple,
          }}
          labelCol={24}
          wrapperCol={24}
        ></FormItem>
      </Form>
      <Button onClick={addHandle}> 添加一项</Button>
    </>
  );
};
export default connect()(Level1SimpleIndex);
