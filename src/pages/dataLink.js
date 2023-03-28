import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Divider } from 'antd';
import FormItem from '@/components/FormItem';

const DataLinkIndex = (props) => {
  const [form] = Form.useForm();
  const [groupValue, setGroupValue] = useState([]);
  return (
    <>
      <Divider orientation="left">表单内容联动</Divider>
      <Form form={form} layout="vertical" initialValues={{}}>
        <FormItem
          ref={form}
          fields={[
            {
              type: 'select',
              required: true,
              label: '规则选择(一)',
              code: 'rules1',
              span: 24,
              dict: [
                {
                  id: '1-1',
                  name: '规则1-1',
                },
                {
                  id: '1-2',
                  name: '规则1-2',
                },
              ],
              onChange: (val) => {
                const index = groupValue.findIndex((i) => i === '1-1' || i === '1-2');
                if (index > -1) {
                  groupValue.splice(index, 1, val);
                } else {
                  groupValue.push(val);
                }
                setGroupValue([...groupValue]);
              },
            },
            {
              type: 'select',
              required: true,
              label: '规则选择(二)',
              code: 'rules2',
              span: 24,
              dict: [
                {
                  id: '2-1',
                  name: '规则2-1',
                },
                {
                  id: '2-2',
                  name: '规则2-2',
                },
              ],
              onChange: (val) => {
                const index = groupValue.findIndex((i) => i === '2-1' || i === '2-2');
                if (index > -1) {
                  groupValue.splice(index, 1, val);
                } else {
                  groupValue.push(val);
                }
                setGroupValue([...groupValue]);
              },
            },
            {
              type: 'text',
              label: '我是规则1-1',
              code: 'rule1-1',
              span: 24,
              group: ['1-1'],
            },
            {
              type: 'text',
              label: '我是规则1-2或2-1',
              code: 'rule1-2,2-1',
              span: 24,
              group: ['1-2', '2-1'],
            },
            {
              type: 'text',
              required: true,
              label: '规则2-2 必填',
              code: 'rule2-2',
              span: 24,
              group: ['2-2'],
            },
            {
              type: 'text',
              label: '规则不是2-2 非必填',
              code: 'rule2-2',
              span: 24,
              group: ['1-1', '1-2', '2-1'],
            },
          ]}
          groupValue={groupValue}
          labelCol={24}
          wrapperCol={24}
        ></FormItem>
      </Form>
    </>
  );
};
export default connect()(DataLinkIndex);
