---
order: 2
title:
  zh-CN: 专业搜索条
  en-US: Professional Query Bar
---

## zh-CN

展示版专业搜索条，样式与 Pro Table `queryBar="professionalBar"` 一致，不依赖 DataSet。通过 `queryFields` 传入带 `label` 的 `TextField`，在 `onQuery` / `onReset` 中自行请求数据。

## en-US

Display professional query bar with the same styles as Pro Table `professionalBar`, without DataSet. Pass labeled `TextField` via `queryFields` and load data in `onQuery` / `onReset`.

```jsx
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Table, TextField } from 'choerodon-ui/pro-display';

const allData = [
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 32 },
  { id: '3', name: '王五', age: 25 },
];

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dataSource, setDataSource] = useState(allData);

  const queryFields = useMemo(
    () => [
      <TextField key="name" label="姓名" value={name} onChange={e => setName(e.target.value)} placeholder="姓名" />,
      <TextField key="age" label="年龄" value={age} onChange={e => setAge(e.target.value)} placeholder="年龄" />,
      <TextField key="extra" label="备注" placeholder="展开后可见" />,
    ],
    [name, age],
  );

  const handleQuery = useCallback(() => {
    setDataSource(
      allData.filter(row => {
        const nameOk = !name || row.name.includes(name);
        const ageOk = !age || String(row.age).includes(age);
        return nameOk && ageOk;
      }),
    );
  }, [name, age]);

  const handleReset = useCallback(() => {
    setName('');
    setAge('');
    setDataSource(allData);
  }, []);

  const columns = useMemo(
    () => [
      { title: '编号', dataIndex: 'id', width: 80 },
      { title: '姓名', dataIndex: 'name' },
      { title: '年龄', dataIndex: 'age', width: 80 },
    ],
    [],
  );

  return (
    <Table
      queryBar="professionalBar"
      queryFields={queryFields}
      queryFieldsLimit={2}
      buttons={[<Button key="add">新建</Button>]}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      onQuery={handleQuery}
      onReset={handleReset}
      autoQueryAfterReset={false}
    />
  );
}

ReactDOM.render(<App />, mountNode);
```
