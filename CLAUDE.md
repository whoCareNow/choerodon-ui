# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Choerodon UI is an enterprise-class React UI library (forked from Ant Design). It has four package layers:

- **`components/`** — Base components (`choerodon-ui`), analogous to antd
- **`components-pro/`** — Pro components (`choerodon-ui/pro`), data-driven via DataSet/MobX
- **`components-pro-display/`** — Lightweight Pro Display subset (`choerodon-ui/pro-display`), built as standalone UMD with no MobX dependency
- **`components-dataset/`** — Data layer (`choerodon-ui/dataset`): DataSet, Record, Field, Axios, stores
- **`components-shared/`** — Shared managers (`choerodon-ui/shared`): MessageManager, ModalManager, NotificationManager

The library targets React 16, MobX 4/5, TypeScript 3.7, and Less for styles.

## Commands

```bash
# Development
npm start                    # Start docs site at http://127.0.0.1:8001

# Build
npm run compile              # Gulp compile TS/Less → lib/, es/, pro/, dataset/, shared/
npm run dist                 # Webpack UMD bundles → dist/
npm run dist:pro-display     # Pro Display standalone UMD bundle

# Testing
npm test                     # Run all Jest tests
npm run test:update          # Run tests and update snapshots
npm run test-node            # Node-only tests (separate jest config)
npm run test-all             # Run all test suites via shell script
npm run test-all-skip        # Run all tests, skip failures

# Linting
npm run lint                 # ESLint + stylelint + demo lint
npm run lint:script          # ESLint only (JS/JSX/TS/TSX)
npm run lint:style           # stylelint only (Less files)
npm run lint:tsc             # TypeScript type checking
npm run lint-fix             # Auto-fix lint issues

# Type checking
npm run tsc                  # Run tsc (no emit, type check only)

# Site
npm run site                 # Production build of docs site
npm run deploy               # Deploy docs to GitHub Pages

# Publishing
npm run pub                  # Full publish pipeline (tests + compile + dist + npm publish)
```

### Running a single test

```bash
npx jest --config .jest.js --cache=false path/to/test-file.test.js
# Example:
npx jest --config .jest.js --cache=false components/button/__tests__/index.test.js
```

## Architecture

### Build pipeline

Two build systems work together:

1. **Gulp (`gulpfile.js`)** — Compiles source to `lib/` (CommonJS), `es/` (ES modules), `pro/`, `dataset/`, `shared/`, `pro-display/`. Uses TypeScript compiler + Babel for transpilation, plus Less → CSS transformation.

2. **Webpack (`webpack.config.js` + `tools/getWebpackConfig.js`)** — Produces UMD bundles in `dist/`. Entry points are `index.js`, `index-pro.js`, `index-pro-display.js`. Creates both minified (`.min.js`) and unminified versions, plus `-with-locales` variants. Externals: react, react-dom, mobx.

### Pro Display build

`scripts/dist-pro-display.js` is a separate webpack build for `components-pro-display/`. Unlike the main Pro build, Pro Display externalizes **only** react and react-dom (no MobX). It uses custom Less variables (blue-6: `#0840f8`) and sets `library: 'choerodon-ui/pro-display'`.

### Data layer (components-dataset)

The core of Pro components. Key classes:

- **DataSet** — Observable record collection (MobX store). Manages CRUD, paging, sorting, filtering, validation.
- **Record** — Single data row with field values, dirty tracking, validation state.
- **Field** — Column definition: type, label, validation rules, bindings, lookups.
- **Transport** — API communication config (read/create/update/destroy).
- **Stores** — LookupCodeStore, LovCodeStore, AttachmentStore for caching reference data.

DataSet components in `components-pro/data-set/` bridge DataSet to React views (DataSetComponent base class).

### Component structure

Each component follows this pattern:
```
component-name/
  index.tsx          # Main export
  index.en-US.md     # English docs
  index.zh-CN.md     # Chinese docs
  style/
    index.tsx        # Style entry (imports .less)
    index.less       # Component styles
  demo/
    basic.md         # Demo code in markdown
  __tests__/
    index.test.js    # Tests
```

### Theme system

Themes are Less-variable-driven. `webpack.config.js` processes theme configs to produce separate CSS bundles per theme. The variable `c7n-root-entry-name` controls the theme entry name. Pro Display uses a hardcoded primary color (`#0840f8`).

### Path aliases (tsconfig.json)

Source paths are aliased to package names:
- `choerodon-ui/lib/*` → `./components/*`
- `choerodon-ui/pro/lib/*` → `./components-pro/*`
- `choerodon-ui/dataset/*` → `./components-dataset/*`
- `choerodon-ui/shared/*` → `./components-shared/*`
- `choerodon-ui/pro-display/lib/*` → `./components-pro-display/*`

### Testing

- Jest with Enzyme (React 16 adapter), `ts-jest` for TypeScript
- Config: `.jest.js` (browser/JSDOM), `.jest.node.js` (Node environment)
- Demo `.md` files are also testable via `tools/jest/demoPreprocessor.js`
- Test setup: `tests/setup.js` — configures Enzyme adapter, mocks `requestAnimationFrame`
- Snapshot serialization: `enzyme-to-json`
- CSS modules are mocked via `identity-obj-proxy`

### Site/Documentation

Built with [bisheng](https://github.com/benjycui/bisheng) static site generator. Config at `site/bisheng.config.js`, theme at `site/theme/`. Source from `components/` and `docs/` directories. Runs on port 8001 with base path `/choerodon-ui/`.
