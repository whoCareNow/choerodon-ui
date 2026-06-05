---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic
---

## zh-CN

受控文本输入，样式与 Pro TextField 一致，不依赖 DataSet。

## en-US

Controlled text input with Pro TextField styling, no DataSet.

```jsx
import React, { useState } from 'react';
import { Form, TextField } from 'choerodon-ui/pro-display';

function Demo() {
  const [value, setValue] = useState('hello');
  return (
    <Form labelWidth={80}>
      <Form.Item label="名称">
        <TextField
          value={value}
          placeholder="请输入"
          onChange={e => setValue(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
}

ReactDOM.render(<Demo />, mountNode);
```
