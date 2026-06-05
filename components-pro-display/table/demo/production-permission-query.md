---
order: 3
title:
  zh-CN: 生产权限查询（模拟）
  en-US: Production Permission Query (Mock)
---

## zh-CN

基于 `testTableCRUD.txt` 的请求参数与返回结构，使用 **pro-display** 的 `Table` + 专业搜索条，数据在本地模拟（`rows.content` 分页），不发起真实请求。

## en-US

Mock query demo for production permission API using pro-display `Table` and professional query bar. Data is filtered and paginated locally to match `rows.content` from `testTableCRUD.txt`.

```jsx
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form, Table } from 'choerodon-ui/pro-display';
import Input from 'choerodon-ui/lib/input';

const PAGE_SIZE = 10;

const MOCK_ALL = [
  {
    creationDate: '2026-03-24 19:49:46',
    createdBy: 1761,
    lastUpdateDate: '2026-04-27 10:51:25',
    lastUpdatedBy: 1741,
    objectVersionNumber: 1,
    permissionId: 1027001,
    formFactor: '111',
    type: '2',
    roleId: 281,
    roleCode: 'businessManager',
    roleName: '业务管理员',
    enableFlag: 'Y',
    enableFlagMeaning: '是',
  },
  {
    creationDate: '2026-03-20 10:00:00',
    createdBy: 1761,
    lastUpdateDate: '2026-04-01 09:30:00',
    lastUpdatedBy: 1741,
    objectVersionNumber: 1,
    permissionId: 1027002,
    formFactor: '111',
    type: '2',
    roleId: 282,
    roleCode: 'planner',
    roleName: '计划员',
    enableFlag: 'Y',
    enableFlagMeaning: '是',
  },
  {
    creationDate: '2026-02-15 14:20:00',
    createdBy: 1700,
    lastUpdateDate: '2026-03-10 11:00:00',
    lastUpdatedBy: 1700,
    objectVersionNumber: 2,
    permissionId: 1027003,
    formFactor: '112',
    type: '2',
    roleId: 281,
    roleCode: 'businessManager',
    roleName: '业务管理员',
    enableFlag: 'N',
    enableFlagMeaning: '否',
  },
];

function mockQuery(page, size, body) {
  const list = MOCK_ALL.filter(row => {
    if (body.formFactor && row.formFactor !== body.formFactor) return false;
    if (body.type && row.type !== body.type) return false;
    if (body.roleName && row.roleName.indexOf(body.roleName) < 0) return false;
    return true;
  });
  const totalElements = list.length;
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
  const number = totalPages === 0 ? 0 : Math.min(page, totalPages - 1);
  const start = number * size;
  const content = list.slice(start, start + size);
  return {
    success: true,
    rows: {
      totalPages,
      totalElements,
      numberOfElements: content.length,
      size,
      number,
      content,
      empty: content.length === 0,
    },
  };
}

function App() {
  const [formFactor, setFormFactor] = useState('111');
  const [type, setType] = useState('2');
  const [roleName, setRoleName] = useState('业务管理员');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const initial = mockQuery(0, PAGE_SIZE, { formFactor: '111', type: '2', roleName: '业务管理员' });
  const [dataSource, setDataSource] = useState(initial.rows.content);
  const [pager, setPager] = useState({
    totalElements: initial.rows.totalElements,
    totalPages: initial.rows.totalPages,
    number: initial.rows.number,
  });

  const applyResult = useCallback(res => {
    if (res.success) {
      setDataSource(res.rows.content);
      setPager({
        totalElements: res.rows.totalElements,
        totalPages: res.rows.totalPages,
        number: res.rows.number,
      });
      setPage(res.rows.number);
    }
  }, []);

  const runQuery = useCallback(
    (nextPage, bodyOverride) => {
      setLoading(true);
      const body = bodyOverride || {
        formFactor: formFactor.trim(),
        type: type.trim(),
        roleName: roleName.trim(),
      };
      const res = mockQuery(nextPage == null ? 0 : nextPage, PAGE_SIZE, body);
      applyResult(res);
      setLoading(false);
    },
    [applyResult, formFactor, type, roleName],
  );

  const defaultQueryBody = { formFactor: '111', type: '2', roleName: '业务管理员' };

  const queryFields = useMemo(
    () => [
      <Form.Item key="formFactor" label="formFactor">
        <Input value={formFactor} onChange={e => setFormFactor(e.target.value)} />
      </Form.Item>,
      <Form.Item key="type" label="type">
        <Input value={type} onChange={e => setType(e.target.value)} />
      </Form.Item>,
      <Form.Item key="roleName" label="roleName">
        <Input value={roleName} onChange={e => setRoleName(e.target.value)} />
      </Form.Item>,
    ],
    [formFactor, type, roleName],
  );

  const columns = useMemo(
    () => [
      { title: '权限ID', dataIndex: 'permissionId', width: 100 },
      { title: 'formFactor', dataIndex: 'formFactor', width: 100 },
      { title: 'type', dataIndex: 'type', width: 72 },
      { title: '角色编码', dataIndex: 'roleCode' },
      { title: '角色名称', dataIndex: 'roleName' },
      {
        title: '是否启用',
        dataIndex: 'enableFlagMeaning',
        width: 88,
        render: (_, record) => record.enableFlagMeaning || record.enableFlag,
      },
      { title: '创建时间', dataIndex: 'creationDate', width: 168 },
      { title: '更新时间', dataIndex: 'lastUpdateDate', width: 168 },
    ],
    [],
  );

  const summaryBar = (
    <span style={{ marginLeft: 8, color: 'rgba(0,0,0,0.45)' }}>
      共 {pager.totalElements} 条，第 {pager.totalPages ? pager.number + 1 : 0} / {pager.totalPages || 0} 页
      <Button
        style={{ marginLeft: 8 }}
        disabled={pager.number <= 0}
        onClick={() => runQuery(page - 1)}
      >
        上一页
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        disabled={pager.totalPages === 0 || pager.number >= pager.totalPages - 1}
        onClick={() => runQuery(page + 1)}
      >
        下一页
      </Button>
    </span>
  );

  return (
    <Table
      queryBar="professionalBar"
      queryFields={queryFields}
      queryFieldsLimit={3}
      buttons={[<Button key="refresh" onClick={() => runQuery(page)}>刷新</Button>]}
      summaryBar={summaryBar}
      columns={columns}
      dataSource={dataSource}
      rowKey="permissionId"
      loading={loading}
      bordered
      onQuery={() => runQuery(0)}
      onReset={() => {
        setFormFactor(defaultQueryBody.formFactor);
        setType(defaultQueryBody.type);
        setRoleName(defaultQueryBody.roleName);
        runQuery(0, defaultQueryBody);
      }}
      autoQueryAfterReset={false}
    />
  );
}

ReactDOM.render(<App />, mountNode);
```
