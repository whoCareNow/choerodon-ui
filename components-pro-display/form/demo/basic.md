---
order: 0
title:
  zh-CN: 基础表单
  en-US: Basic Form
---

## zh-CN

展示版表单布局，子节点可为任意 React 节点（如基础 Input）。

## en-US

Display form layout with arbitrary children.

```jsx
import { Form } from 'choerodon-ui/pro-display';
import { Input } from 'choerodon-ui';

ReactDOM.render(
  <Form labelLayout="horizontal" labelWidth={100} useColon>
    <Form.Item label="用户名" required>
      <Input placeholder="请输入" />
    </Form.Item>
    <Form.Item label="备注">
      <Input.TextArea rows={2} placeholder="选填" />
    </Form.Item>
  </Form>,
  mountNode,
);
```
