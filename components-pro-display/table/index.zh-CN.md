---
category: Pro Display
type: Data Display
title: Table
subtitle: 展示表格
---

只读数据表格，API 类似 `columns` + `dataSource`。支持 Pro 同款 **专业搜索条**（`queryBar="professionalBar"`），无 DataSet、编辑与虚拟滚动。

也可单独使用 `Table.ProfessionalBar` / `ProfessionalQueryBar`。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列定义 | ColumnType[] | - |
| dataSource | 数据源 | object[] | `[]` |
| rowKey | 行 key | string \| function | index |
| bordered | 边框 | boolean | - |
| loading | 加载中 | boolean | - |
| title | 表格标题 | ReactNode | - |
| queryBar | 查询栏，`professionalBar` 或自定义节点 | `'professionalBar'` \| ReactNode | - |
| queryFields | 专业搜索表单项（`Form.Item` 等） | ReactNode[] | - |
| queryFieldsLimit | 主区域字段数，超出折叠到「更多」 | number | `3` |
| buttons | 工具栏按钮 | ReactNode[] | - |
| formProps | 查询区 Form 属性 | FormProps | - |
| onQuery | 点击查询 | () => void | - |
| onReset | 点击重置 | () => void | - |
| onBeforeQuery | 查询前钩子，返回 `false` 中止 | () => boolean \| void \| Promise<...> | - |
| autoQueryAfterReset | 重置后是否触发查询 | boolean | `true` |
| summaryBar | 工具栏摘要区 | ReactNode | - |
| queryBarProps | 传给 `ProfessionalQueryBar` 的额外属性 | object | - |

### ColumnType

| 属性 | 说明 |
| --- | --- |
| title | 列头 |
| dataIndex | 字段路径 |
| width | 列宽 |
| render | 自定义渲染 |
