---
order: 0
title:
  zh-CN: 基础表格
  en-US: Basic Table
---

## zh-CN

只读表格，使用 `columns` 与 `dataSource`，无 DataSet。

## en-US

Read-only table with `columns` and `dataSource`.

```jsx
import { Table } from 'choerodon-ui/pro-display';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
  { title: '地址', dataIndex: 'address', key: 'address' },
];

const data = [
  { key: '1', name: '张三', age: 28, address: '上海' },
  { key: '2', name: '李四', age: 32, address: '北京' },
];

ReactDOM.render(
  <Table columns={columns} dataSource={data} rowKey="key" bordered title="用户列表" />,
  mountNode,
);
```
