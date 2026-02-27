# Code Review Action Checklist

Quick reference checklist for addressing code review findings.

## 🔴 Critical Priority (Do First)

### Week 1 - Quick Wins

- [ ] **Add ESLint Configuration**
  - [ ] Create `packages/graphic-walker/.eslintrc.cjs`
  - [ ] Install ESLint dependencies
  - [ ] Run `eslint --fix src/`
  - [ ] Add linting to package.json scripts

- [ ] **Enable Tests in CI**
  - [ ] Modify `.github/workflows/auto-build.yml`
  - [ ] Add test execution step
  - [ ] Make build fail on test failures
  - [ ] Add code coverage upload (Codecov)

- [ ] **Fix Package Dependencies**
  - [ ] Move Jest from dependencies to devDependencies
  - [ ] Run `npm audit fix`
  - [ ] Update critical outdated packages
  - [ ] Test that everything still works

- [ ] **TypeScript Configuration**
  - [ ] Change `noImplicitAny: false` to `true`
  - [ ] Fix resulting type errors
  - [ ] Document any necessary exceptions

---

## ⚠️ High Priority (This Month)

### Week 2-3 - Type Safety

- [ ] **Fix Type Assertions**
  - [ ] Replace `as any` in `observable-plot-renderer.tsx` (4 occurrences)
  - [ ] Replace `as any` in `components/painter/index.tsx` (4 occurrences)
  - [ ] Fix other high-impact `as any` casts (prioritize by usage)
  - [ ] Create proper type definitions instead

- [ ] **Remove TypeScript Suppressions**
  - [ ] Address `@ts-ignore` in `renderer/specRenderer.tsx` (7 occurrences)
  - [ ] Address `@ts-ignore` in `utils/save.ts` (4 occurrences)
  - [ ] Fix root causes instead of suppressing

### Week 3-4 - Testing Foundation

- [ ] **Set Up Testing Infrastructure**
  - [ ] Install React Testing Library
  - [ ] Install jest-dom
  - [ ] Create test utilities/helpers
  - [ ] Set up test coverage reporting

- [ ] **Write Initial Component Tests**
  - [ ] Test GraphicWalker main component (10 tests)
  - [ ] Test PosFields component (5 tests)
  - [ ] Test AestheticFields component (5 tests)
  - [ ] Test FilterField component (5 tests)
  - [ ] Target: 20% coverage

---

## 📊 Medium Priority (This Quarter)

### Month 2 - Code Quality

- [ ] **Clean Up Console Statements**
  - [ ] Audit all 29 files with console statements
  - [ ] Remove unnecessary console.log calls
  - [ ] Guard necessary logs with environment checks
  - [ ] Add proper error logging library

- [ ] **Address Technical Debt**
  - [ ] Create GitHub issues for all 14 TODO/FIXME items
  - [ ] Fix high-priority TODOs (deprecated props)
  - [ ] Add deprecation warnings for `channelScales`
  - [ ] Plan removal in next major version

- [ ] **Pre-commit Hooks**
  - [ ] Install Husky
  - [ ] Configure lint-staged
  - [ ] Run ESLint on staged files
  - [ ] Run Prettier on staged files
  - [ ] Run type checking

### Month 3 - Comprehensive Testing

- [ ] **Expand Test Coverage**
  - [ ] Test visualSpecStore (20+ tests)
  - [ ] Test dataStore (10+ tests)
  - [ ] Test commonStore (10+ tests)
  - [ ] Test Vega spec generation (30+ tests)
  - [ ] Test Web Workers (15+ tests)
  - [ ] Target: 50% coverage

- [ ] **Integration Tests**
  - [ ] Test complete user workflows
  - [ ] Test data loading and transformation
  - [ ] Test chart creation and updates
  - [ ] Test filters and sorting

- [ ] **E2E Tests**
  - [ ] Set up Playwright
  - [ ] Test drag-and-drop interactions
  - [ ] Test chart rendering
  - [ ] Test data export
  - [ ] Run in CI

---

## 📝 Lower Priority (Ongoing)

### Documentation

- [ ] **Contributing Guide**
  - [ ] Create CONTRIBUTING.md
  - [ ] Document development setup
  - [ ] Explain code structure
  - [ ] Add coding standards
  - [ ] Describe PR process

- [ ] **API Documentation**
  - [ ] Set up TypeDoc
  - [ ] Generate API reference
  - [ ] Add examples for each component
  - [ ] Host on GitHub Pages

- [ ] **Architecture Documentation**
  - [ ] Create architecture.md
  - [ ] Add Mermaid diagrams
  - [ ] Explain data flow
  - [ ] Document store patterns

- [ ] **Changelog**
  - [ ] Create CHANGELOG.md
  - [ ] Document all releases
  - [ ] Follow Keep a Changelog format
  - [ ] Automate with release workflow

### Monitoring & Performance

- [ ] **Bundle Size**
  - [ ] Add vite-plugin-bundle-analyzer
  - [ ] Set size budgets
  - [ ] Monitor in CI
  - [ ] Optimize large dependencies

- [ ] **Code Coverage**
  - [ ] Add Codecov integration
  - [ ] Set coverage thresholds
  - [ ] Add badges to README
  - [ ] Track trends over time

- [ ] **Performance Monitoring**
  - [ ] Add React DevTools Profiler analysis
  - [ ] Optimize re-renders
  - [ ] Consider store splitting
  - [ ] Add performance tests

### Accessibility

- [ ] **A11y Testing**
  - [ ] Install eslint-plugin-jsx-a11y
  - [ ] Add to ESLint config
  - [ ] Fix accessibility issues
  - [ ] Add axe-core testing

- [ ] **Keyboard Navigation**
  - [ ] Test all interactions with keyboard
  - [ ] Ensure focus management
  - [ ] Add keyboard shortcuts documentation

### Security

- [ ] **Regular Audits**
  - [ ] Run npm audit monthly
  - [ ] Enable Dependabot
  - [ ] Review security advisories
  - [ ] Update dependencies regularly

- [ ] **XSS Prevention**
  - [ ] Audit `dangerouslySetInnerHTML` usage
  - [ ] Add DOMPurify for sanitization
  - [ ] Add security tests
  - [ ] Document safe usage patterns

---

## Progress Tracking

### Metrics Dashboard

Create a dashboard to track:
- Test coverage percentage (weekly)
- Number of console statements (weekly)
- Number of TODO comments (monthly)
- Number of type assertions (monthly)
- Bundle size (per release)
- Build time (per release)

### Weekly Standup Questions

1. How many tests were added this week?
2. Were any TODO items resolved?
3. Did coverage increase?
4. Were any dependencies updated?
5. What blockers exist?

---

## Review Schedule

- **Week 1:** Review critical items
- **Week 2:** Review progress on high priority
- **Month 1:** Review overall progress
- **Month 3:** Full re-review of codebase

---

## Success Criteria

### After Week 1
- ✅ ESLint is configured and running
- ✅ Tests run in CI
- ✅ No critical dependency vulnerabilities

### After Month 1
- ✅ Test coverage > 20%
- ✅ Type safety improved (noImplicitAny: true)
- ✅ Console statements < 15 files
- ✅ Pre-commit hooks working

### After Month 3
- ✅ Test coverage > 50%
- ✅ All critical TODOs resolved
- ✅ E2E tests in place
- ✅ Documentation complete
- ✅ Bundle size optimized

---

**Note:** This is a living document. Update as priorities change and progress is made.

**Last Updated:** February 27, 2026
