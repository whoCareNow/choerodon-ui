# components-pro-display

Pro 组件的**展示版**实现：**运行时 JS 不依赖** `choerodon-ui/dataset` / MobX；样式仍复用 `choerodon-ui` / `pro` 的 Less（仅构建期 CSS）。

## 架构说明

| 层级 | 依赖 |
|------|------|
| 组件逻辑 (`*.tsx`) | 仅 React + 本包 `primitives/`、`_util/config` |
| 样式 (`style/index.tsx`) | `choerodon-ui/lib`、`pro` 的 **`.less` 文件**（无 DataSet JS） |
| UMD 包 | 仅需 React 16，不含 MobX |

## 与 `choerodon-ui/pro` 的区别

| 能力 | pro | pro-display |
|------|-----|-------------|
| DataSet / Record / Field | 支持 | 不支持 |
| 表单校验、提交 | 支持 | 不支持 |
| Table 专业搜索条 | DataSet 驱动 | 受控 props + 回调 |
| Pro 视觉样式 | 支持 | 复用 Pro 样式 |
| UMD / 纯 HTML | 需完整 Pro 包 | **轻量 pro-display 包** |

## NPM（React 工程）

```tsx
import { Button, Form, Table } from 'choerodon-ui/pro-display';
import 'choerodon-ui/pro-display/lib/style';
```

## UMD（纯 HTML）

### 1. 构建

```bash
npm run dist:pro-display
```

产物：

- `dist/choerodon-ui-pro-display.min.js` — 全局 `window['choerodon-ui/pro-display']`
- `dist/choerodon-ui-pro-display.min.css`

**无需** 引入 MobX / DataSet；仅需 React 16。

### 2. 引入

```html
<link rel="stylesheet" href="./dist/choerodon-ui-pro-display.min.css" />
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="./dist/choerodon-ui-pro-display.min.js"></script>
```

### 3. 使用

```html
<script src="./dist/choerodon-ui-pro-display.min.js"></script>
<script src="./components-pro-display/demo/standalone/umd-boot.js"></script>
<script type="text/babel">
  const { Button, Table, Form } = getChoerodonProDisplay();
  // ReactDOM.render(...)
</script>
```

### 4. 本地 Demo

构建完成后，用静态服务打开（不要用 file:// 直接双击）：

```bash
npx serve .
# 浏览器访问
# /components-pro-display/demo/standalone/basic.html
# /components-pro-display/demo/standalone/production-permission-query.html
```

## 开发

| 项 | 路径 |
|----|------|
| 源码 | `components-pro-display/` |
| CJS/ES | `pro-display/lib`、`pro-display/es`（`npm run compile`） |
| UMD | `dist/choerodon-ui-pro-display.min.js`（`npm run dist:pro-display`） |
| 入口 | `index-pro-display.js` |
| 文档站 demo | `components-pro-display/**/demo/*.md`（`npm start`） |
| **实现程度说明** | [IMPLEMENTATION.md](./IMPLEMENTATION.md) |
