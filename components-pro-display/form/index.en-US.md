---
category: Pro Display
type: Data Entry
title: Form
subtitle: Display Form
---

Pro form **layout** only (labels, grid). No `dataSet`, `record`, validation, or submit.

## API

### Form

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| labelLayout | Label layout | string | `horizontal` |
| labelWidth | Label width | number \| auto | `100` |
| useColon | Colon after label | boolean | `false` |

### Form.Item

| Property | Description | Type |
| --- | --- | --- |
| label | Label text | ReactNode |
| required | Required mark | boolean |
| children | Control (any) | ReactNode |
