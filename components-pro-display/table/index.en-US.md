---
category: Pro Display
type: Data Display
title: Table
subtitle: Display Table
---

Read-only table with `columns` and `dataSource`. Supports the Pro **professional query bar** (`queryBar="professionalBar"`) without DataSet, editing, or virtualization.

Use `Table.ProfessionalBar` / `ProfessionalQueryBar` standalone when needed.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column definitions | ColumnType[] | - |
| dataSource | Row data | object[] | `[]` |
| rowKey | Row key | string \| function | index |
| bordered | Bordered | boolean | - |
| loading | Loading | boolean | - |
| title | Table title | ReactNode | - |
| queryBar | Query bar: `professionalBar` or custom node | `'professionalBar'` \| ReactNode | - |
| queryFields | Query form fields (`Form.Item`, etc.) | ReactNode[] | - |
| queryFieldsLimit | Visible fields before "More" | number | `3` |
| buttons | Toolbar buttons | ReactNode[] | - |
| formProps | Form props for query area | FormProps | - |
| onQuery | Query handler | () => void | - |
| onReset | Reset handler | () => void | - |
| onBeforeQuery | Before query; return `false` to abort | () => boolean \| void \| Promise<...> | - |
| autoQueryAfterReset | Query after reset | boolean | `true` |
| summaryBar | Toolbar summary slot | ReactNode | - |
| queryBarProps | Extra props for `ProfessionalQueryBar` | object | - |
