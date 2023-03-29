# antd-form-multi
基于react antd的多级列表库



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