# antd-form-multi
## 背景

在前端中后台的开发中，常见的业务场景是对表单的处理。对于简单、交互少、联动少的业务场景直接使用antd提供的Form组件就可以，对于追求性能，需要复杂表单生成的时候可以使用 formily 开源库，但其付出的学习成本会更高。所以本库是介于两者之间的一个便捷、高效、易于理解、且功能相对完整、适用于绝大多数业务场景开发的一个库。

## 特性

 + 高效：自定义的配置项生成表单。
 + 强大：拥有表单内数据联动，多级列表控制等功能
 + 简单：其中基于 AntdV4 ，所有组件 API 保持一致，降低开发人员心智负担。

## 安装
`npm install antd-form-multi` 

或者

`yarn add antd-form-multi`

在组件内的<Form>（antd组件）内引用

`import FormItem from 'antd-form-multi'`

## 用法和实例说明
### [基础用法](https://cmg-ceo.github.io/antdform.github.io/#/./base)
```jsx
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import FormItem from 'antd-form-multi';

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
}
```
+ ref 为表单实例项
+ fields 表单内每一控件的配置信息，详情配置信息参考下文（fields配置项）
+ labelCol、wrapperCol 每一项的标签和输入控件的布局样式


### [数据联动](https://cmg-ceo.github.io/antdform.github.io/#/./dataLink)
```jsx
        const [groupValue, setGroupValue] = useState([]);
        ...
        <FormItem
          ref={form}
          fields={[
            {
              type: 'select',
              required: true,
              label: '规则选择(一)',
              code: 'rules1',
              span: 24,
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
              options: [
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
```
采用组的概念，将需要显示的内容全部传入`fields`内，当`groupValue` 内匹配有 `group` 时则该项显示，如果`field`没有`group` 则一值展示

所以你只需要在触发改变`group` 时进行配置即可

### [一级列表](https://cmg-ceo.github.io/antdform.github.io/#/./level1)
### [二级列表](https://cmg-ceo.github.io/antdform.github.io/#/./level2)
```jsx
    import FormItem, { FormWrapCard, addLevel1 } from '@/components/FormItem';
    ...
      const addHandle = () => {
        addLevel1(form, ['list'], {});
      };
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
```
#### level1

level1 的配置项参考下方API

这里提供了增加一级列表的函数

`addLevel1`：(form:表单的ref,[]:一级列表的名称,{}:一级列表的默认值)=>void

#### level2
二级列表的API与一级列表保持一致


### [一级列表-联动](https://cmg-ceo.github.io/antdform.github.io/#/./dataLinkLevel1)

基本与 数据联动一致，通过改变level1 内的groupValue的值显示/隐藏对应组的field，

> 这里是隐藏，当切换，使得隐藏的显示时，隐藏的输入控件的内容会被保留，但表单提交时，也会保留
> 如果不希望保留得话，需要手动清除值
#### groupValue
是一个数据集合，例如

```js
groupValue = [[0,['group1']],[1,['group2','group3']]]
```

第一项 `0` 是`name`对应的 一级列表 的索引，第二项 `['group1']`是一个数组，对应的是该索引列表的组的规则，满足规则的 field 项显示

当 fields 其中一项改变时，接收的参数为2个，第一个是改变的值，第二个是改变的 name 的索引值

例如
```jsx
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
```
我们可以通过`onChange`回调函数来接收到这两个参数，并且通过自己的方式去改变对应组的值

### [二级列表-联动](https://cmg-ceo.github.io/antdform.github.io/#/./dataLinkLevel2)
基本上与一级列表一致
在组的定义上，多了一层

```js
groupValue = [[0,0,['group1']],[0,1,['group2','group3']]]
```

第一项 `0` 是一级列表对应的索引，第二项是二级列表 `name`对应的索引， 第三项 `['group1']`是一个数组，对应的是该索引列表的组的规则，满足规则的 field 项显示

当 fields 其中一项改变时，接收的参数为3个，第一个是改变的值，第二个是改变的 name 的索引值，第三个是上级/第一级的索引值

## API
### fields配置项
#### type
| 参数 | 说明 |
| --- | --- |
| datePicker | 日期选择器 |
| rangePicker | 日期范围选择器 |
| timePicker | 时间选择器 |
| timeRangePicker | 时间范围选择器 |
| switch | 开关 |
| radio | 圆形单选框 |
| radio_button | 方形单选框 |
| checkbox | 复选框 |
| text | 输入框 |
| password | 密码输入框 |
| text_group | 输入组 |
| textarea | 输入框-文本域 |
| number_text | 数字输入框 |
| select | 选择框 |
| select_multi | 多选框 |
| autoComplete | 自动完成 |
| upload | 文件上传 |
| transfer | 穿梭框 |
| table | 表格 |
| template | 自定义 |

#### code
对应 `antd` 文档的 `name` 

#### span 
表示控件的占位大小（24份大小）

#### 其余
与 `antd` 文档API 一致


### 配置项

| 参数 | 说明 | 类型 | 默认值|
| --- | --- | --- | --- |
| fields | 列表的表单配置 | Array | - |
| labelCol | 表单的label占位宽度 | Number | 6 |
| wrapperCol | 表单的wrapper占位宽度 | Number | 18 |
| offset | 表单的offset占位宽度 | Number | null |
| plugin | 自行添加的组件插件 | [] | [] |

#### plugin
+ 类型 `Array`
  包含多个对象，对象内字段为
  + `type`(String):对应`fields` 内的 `type`，如果与 `fields配置项`冲突，则使用该type
  + `component`(Function):接收 item 字段，该字段包含传入的配置参数，field包含改项的位置参数。返回值：一个组件
+ 示例
  ```js
  plygin=[
    {
        type:'input',
        component:(item,field)=><input></input>
    }
  ]
  ```


### level1 配置项

| 参数 | 说明 | 类型 | 默认值|
| --- | --- | --- | --- |
| name | 列表的名称 | Array | - |
| fields | 列表的表单配置 | Array | - |
| rules | 列表的规则（参照 antd 的配置） | Array | - |
| openLabel | 列表的标题显示 | Boolean | false |
| labelCol | 表单的label占位宽度 | Number | 6 |
| wrapperCol | 表单的wrapper占位宽度 | Number | 18 |
| offset | 表单的offset占位宽度 | Number | null |
| WrapComponent | 包裹组件 | React.Element | <></> |
| wrapName | 包裹组件的名称 | String | '新的标签页' |
| wrapCopy | 包裹组件复制操作 | Boolean | false |
| wrapMove | 包裹组件移动操作 | Boolean | false |
| sortable | 包裹组件可拖拽 | Boolean | false |  

### level2 配置项与 level1 一致

level2配置暂不支持

| sortable | 包裹组件可拖拽 | Boolean | false | 
| --- | --- | --- | ---|