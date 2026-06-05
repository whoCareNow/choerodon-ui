---
category: Pro Display
type: Data Entry
title: Form
subtitle: 展示表单
---

仅提供 Pro 表单**布局**（标签、栅格），不支持 `dataSet`、`record`、校验与提交。

## API

### Form

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| labelLayout | 标签布局 | `horizontal` `vertical` `none` 等 | `horizontal` |
| labelWidth | 标签宽度 | number \| auto \| array | `100` |
| labelAlign | 标签对齐 | `left` `right` `center` | `right` |
| useColon | 冒号 | boolean | `false` |

### Form.Item

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| label | 标签 | ReactNode |
| required | 必填星号 | boolean |
| children | 控件（任意） | ReactNode |
