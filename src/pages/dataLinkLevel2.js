import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Button, Divider } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import FormItem, { FormWrapCard, addLevel1, addLevel2 } from '@/components/FormItem';

const DataLinkLevel2Index = (props) => {
  const [form] = Form.useForm();
  const [groupLevel2, setGroupLevel2] = useState([['default', 'default', ['default']]]);
  const [groupLevel1, setGroupLevel1] = useState([['default', ['default']]]);

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
      <Divider orientation="left">表单二级内容联动</Divider>
      <Form form={form} layout="vertical" initialValues={{}}>
        <FormItem
          ref={form}
          level1={{
            name: ['list'],
            fields: [
              {
                type: 'select',
                required: true,
                label: '规则选择(一)',
                code: 'rules1',
                span: 12,
                options: [
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
                  const index = groupLevel1.findIndex((i) => i[0] === nameList[0]);
                  const name = nameList[0];
                  if (index > -1) {
                    groupLevel1.splice(index, 1, [name, [val]]);
                  } else {
                    groupLevel1.push([name, [val]]);
                  }
                  setGroupLevel1([...groupLevel1]);
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
            groupValue: groupLevel1,
            WrapComponent: FormWrapCard,
            openLabel: true,
            wrapCopy: true,
            wrapMove: true,
            wrapAction: (field) => <PlusCircleOutlined onClick={() => addHandleLevel2(field)} />,
          }}
          level2={{
            name: ['level2'],
            fields: [
              {
                type: 'select',
                required: true,
                label: '规则选择(一)',
                code: 'rules1',
                span: 12,
                options: [
                  {
                    id: '1-1',
                    name: '规则1-1',
                  },
                  {
                    id: '1-2',
                    name: '规则1-2',
                  },
                ],
                onChange: (val, level1Name, level2Name) => {
                  const index = groupLevel2.findIndex(
                    (i) => i[0] === level1Name && i[1] === level2Name
                  );
                  if (index > -1) {
                    groupLevel2.splice(index, 1, [level1Name, level2Name, [val]]);
                  } else {
                    groupLevel2.push([level1Name, level2Name, [val]]);
                  }
                  setGroupLevel2([...groupLevel2]);
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
            groupValue: groupLevel2,
            WrapComponent: FormWrapCard,
            openLabel: true,
            wrapCopy: true,
            wrapMove: true,
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
export default connect()(DataLinkLevel2Index);
