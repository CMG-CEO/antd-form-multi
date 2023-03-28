import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Button, Divider } from 'antd';
import FormItem, { FormWrapCard, addLevel1 } from '@/components/FormItem';

const DataLinkLevel1Index = (props) => {
  const [form] = Form.useForm();
  const [groupListValue, setGroupListValue] = useState([['default', ['default']]]);
  const addHandle = () => {
    addLevel1(form, ['list'], {});
  };
  return (
    <>
      <Divider orientation="left">表单一级内容联动</Divider>
      <Form form={form} layout="vertical" initialValues={{}}>
        <FormItem
          ref={form}
          groupListValue={groupListValue}
          level1={{
            name: ['list'],
            fields: [
              {
                type: 'select',
                required: true,
                label: '规则选择(一)',
                code: 'rules1',
                span: 12,
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
                onChange: (val, nameList) => {
                  const index = groupListValue.findIndex((i) => i[0] === nameList[0]);
                  const name = nameList[0];
                  if (index > -1) {
                    groupListValue.splice(index, 1, [name, [val]]);
                  } else {
                    groupListValue.push([name, [val]]);
                  }
                  setGroupListValue([...groupListValue]);
                },
              },
              {
                type: 'text',
                label: '我是规则1-1',
                code: 'rule1-1',
                span: 12,
                group: ['1-1'],
              },
              {
                type: 'text',
                label: '我是规则1-2',
                code: 'rule1-2,2-1',
                span: 12,
                group: ['1-2'],
              },
            ],
            groupValue: groupListValue,
            WrapComponent: FormWrapCard,
            openLabel: true,
            wrapCopy: true,
            wrapMove: true,
            labelCol: 8,
            wrapperCol: 16,
          }}
          labelCol={24}
          wrapperCol={24}
        ></FormItem>
      </Form>
      <Button onClick={addHandle}> 添加一项</Button>
      <Button
        onClick={() => {
          console.log('form', form.getFieldsValue());
        }}
      >
        表单参数
      </Button>
    </>
  );
};
export default connect()(DataLinkLevel1Index);
