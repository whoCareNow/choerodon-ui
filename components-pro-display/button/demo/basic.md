---
order: 0
title:
  zh-CN: 基础按钮
  en-US: Basic
---

## zh-CN

Pro Display 按钮：无 DataSet，仅展示与点击。

## en-US

Display button without DataSet.

```jsx
import { Button } from 'choerodon-ui/pro-display';

ReactDOM.render(
  <div>
    <Button color="primary">Primary</Button>
    <Button color="secondary" style={{ marginLeft: 8 }}>Secondary</Button>
    <Button funcType="flat" color="blue" style={{ marginLeft: 8 }}>Flat</Button>
  </div>,
  mountNode,
);
```
