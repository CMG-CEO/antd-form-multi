import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import WForm from '@/components/FormItemTemp/WForm';
import FormItemTemp from '@/components/FormItemTemp';

const Index = (props) => {
  const [formDB] = Form.useForm();
  return (
    <>
      <WForm form={formDB} layout="vertical" initialValues={{}}>
        <FormItemTemp
          ref={formDB}
          fields={[
            {
              type: 'text',
              required: true,
              label: '标题',
              code: 'title',
              span: 24,
              vertical: true,
              isrow: true,
            },
            {
              type: 'textarea',
              label: '备注',
              code: 'remark',
              span: 24,
              vertical: true,
              isrow: true,
            },
          ]}
        ></FormItemTemp>
      </WForm>
    </>
  );
};
export default connect()(Index);
