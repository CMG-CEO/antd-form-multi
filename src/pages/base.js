import React from 'react';
import { connect } from 'dva';
import { Form, Row } from 'antd';
import FormItem from '@/components/FormItem';

const Index = (props) => {
  const [form] = Form.useForm();
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
            {
              type: 'textarea',
              label: '备注',
              code: 'remark',
              span: 10,
            },
          ]}
          labelCol={24}
          wrapperCol={24}
        ></FormItem>
      </Form>
    </>
  );
};
export default connect()(Index);
