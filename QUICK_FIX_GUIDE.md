# Quick Fix Guide - Critical Issues

This document provides ready-to-implement solutions for the most critical issues found in the code review.

---

## 1. Add ESLint Configuration

### Create `.eslintrc.cjs` in `packages/graphic-walker/`

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Console statements
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // TypeScript specific
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // React specific
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Accessibility
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
  },
};
```

### Install Dependencies

```bash
cd packages/graphic-walker
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y
```

### Add to `package.json` Scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

### Run ESLint

```bash
npm run lint:fix
```

---

## 2. Enable Tests in CI

### Update `.github/workflows/auto-build.yml`

```yaml
name: Auto Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'yarn'
      
      - name: Install Dependencies
        run: yarn install --frozen-lockfile
      
      - name: Lint
        run: yarn workspace @kanaries/graphic-walker lint
      
      - name: Type Check
        run: yarn workspace @kanaries/graphic-walker type
      
      - name: Test
        run: yarn workspace @kanaries/graphic-walker test --coverage
      
      - name: Upload Coverage
        if: matrix.node-version == '20.x'
        uses: codecov/codecov-action@v3
        with:
          files: ./packages/graphic-walker/coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
      
      - name: Build
        run: yarn build
```

---

## 3. Fix TypeScript Configuration

### Update `packages/graphic-walker/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "downlevelIteration": true,
    "noImplicitAny": true,  // ✅ Changed from false to true
    "noUnusedLocals": true,  // ✅ Added
    "noUnusedParameters": true,  // ✅ Added
    "noImplicitReturns": true,  // ✅ Added
    "noFallthroughCasesInSwitch": true,  // ✅ Added
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react",
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      { "transform": "typescript-transform-paths" },
      { "transform": "typescript-transform-paths", "afterDeclarations": true }
    ]
  },
  "include": ["src"]
}
```

---

## 4. Fix Package.json Dependencies

### Move Jest to devDependencies

In `packages/graphic-walker/package.json`, move Jest from `dependencies` to `devDependencies`:

```json
{
  "dependencies": {
    // Remove these:
    // "jest": "^29.6.2",
    // "@types/jest": "^29.5.3",
    // (keep other dependencies)
  },
  "devDependencies": {
    // Add these:
    "jest": "^29.6.2",
    "@types/jest": "^29.5.3",
    "ts-jest": "^29.1.1",
    // (keep other devDependencies)
  }
}
```

---

## 5. Add Pre-commit Hooks

### Install Husky and lint-staged

```bash
cd /home/runner/work/graphic-walker/graphic-walker
npm install --save-dev husky lint-staged
npx husky install
```

### Create `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Add to `package.json` (root)

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "packages/graphic-walker/src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 6. Set Up React Testing Library

### Install Dependencies

```bash
cd packages/graphic-walker
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/testing-library__jest-dom
```

### Update `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/main.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
```

### Create `src/setupTests.ts`

```typescript
import '@testing-library/jest-dom';
```

### Example Component Test

Create `src/components/__tests__/GraphicWalker.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { GraphicWalker } from '../GraphicWalker';

describe('GraphicWalker', () => {
  it('renders without crashing', () => {
    const mockData = [
      { name: 'Test', value: 100 }
    ];
    
    render(<GraphicWalker data={mockData} />);
    
    // Add assertions based on what should be visible
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
  
  it('handles empty data', () => {
    render(<GraphicWalker data={[]} />);
    
    // Add assertions
  });
});
```

---

## 7. Fix Common Type Assertions

### Example: Replace `as any` with Proper Types

**Before (src/vis/observable-plot-renderer.tsx):**
```typescript
const data = props.data as any;
const options = props.options as any;
```

**After:**
```typescript
import type { PlotOptions } from '@observablehq/plot';

interface PlotData {
  [key: string]: unknown;
}

const data = props.data as PlotData[];
const options = props.options as PlotOptions;
```

### Example: Fix @ts-ignore

**Before (src/renderer/specRenderer.tsx):**
```typescript
// @ts-ignore
const spec = generateVegaSpec(data);
```

**After:**
```typescript
// Define proper return type for generateVegaSpec
function generateVegaSpec(data: IRow[]): VegaSpec {
  // implementation
}

const spec = generateVegaSpec(data);
```

---

## 8. Clean Up Console Statements

### Create Logging Utility

Create `src/utils/logger.ts`:

```typescript
const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
```

### Replace Console Statements

**Before:**
```typescript
console.log('Data loaded:', data);
```

**After:**
```typescript
import { logger } from '@/utils/logger';

logger.debug('Data loaded:', data);
```

---

## 9. Add Deprecation Warnings

### Example: Deprecate `channelScales` prop

In `src/App.tsx`:

```typescript
interface GraphicWalkerProps {
  /** @deprecated Use visualConfig instead. Will be removed in v1.0.0 */
  channelScales?: ChannelScales;
  visualConfig?: VisualConfig;
}

export function GraphicWalker(props: GraphicWalkerProps) {
  const { channelScales, visualConfig, ...restProps } = props;
  
  // Add deprecation warning
  if (channelScales !== undefined) {
    console.warn(
      'Warning: The "channelScales" prop is deprecated and will be removed in v1.0.0. ' +
      'Please use "visualConfig" instead. ' +
      'See migration guide: https://github.com/Kanaries/graphic-walker/wiki/Migration-v1.0'
    );
  }
  
  // Rest of component
}
```

---

## 10. Add .gitignore for Temporary Files

Ensure `/tmp/` is in `.gitignore`:

```gitignore
# Testing
coverage/
*.lcov

# Temporary files
/tmp/
*.tmp
*.temp

# Build
dist/
build/

# Dependencies
node_modules/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## Quick Command Reference

```bash
# Install all dependencies
yarn install

# Lint the code
yarn workspace @kanaries/graphic-walker lint

# Fix linting issues
yarn workspace @kanaries/graphic-walker lint:fix

# Run tests
yarn workspace @kanaries/graphic-walker test

# Run tests with coverage
yarn workspace @kanaries/graphic-walker test --coverage

# Build the library
yarn workspace @kanaries/graphic-walker build

# Type check
yarn workspace @kanaries/graphic-walker type

# Run all checks (lint + test + build)
yarn workspace @kanaries/graphic-walker lint && \
yarn workspace @kanaries/graphic-walker test && \
yarn workspace @kanaries/graphic-walker build
```

---

## Validation Checklist

After implementing these fixes, verify:

- [ ] ESLint runs without errors
- [ ] All tests pass
- [ ] Build completes successfully
- [ ] TypeScript compiles without errors
- [ ] No new warnings introduced
- [ ] CI pipeline passes
- [ ] Code coverage is reported
- [ ] Pre-commit hooks work correctly

---

**Note:** Make changes incrementally and test after each change to avoid breaking the build.

**Priority Order:**
1. Add ESLint configuration
2. Enable tests in CI
3. Fix package.json dependencies
4. Update TypeScript config
5. Add pre-commit hooks
6. Set up React Testing Library
7. Fix type assertions
8. Clean up console statements
9. Add deprecation warnings
10. Update .gitignore
