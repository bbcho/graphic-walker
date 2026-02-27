# 50% Coverage Quick Reference Checklist

**Goal:** 113/226 files tested (50%) | Current: 13 files (5.8%)  
**Need:** +100 test files over 12 weeks

---

## Phase 1: Critical Core (Weeks 1-3) → 21% Coverage

### Week 1: Store Module (7 files) 🔴
- [ ] `store/visualSpecStore.ts` (900 lines) - Chart state, encoding, undo/redo
- [ ] `store/dataStore.ts` (200 lines) - Data loading, caching
- [ ] `store/commonStore.ts` (150 lines) - UI state, preferences
- [ ] `store/theme.ts` (100 lines) - Theme management
- [ ] `store/storeStateLib.ts` (100 lines) - Serialization
- [ ] `store/context.ts` (50 lines) - Context setup
- [ ] `store/index.tsx` (50 lines) - Store initialization

### Week 2: Data Source (11 files) 🔴
- [ ] `dataSource/index.tsx` (280 lines) - File upload, format detection
- [ ] `dataSource/config.tsx` (150 lines) - Configuration
- [ ] `dataSource/selection.tsx` (100 lines) - Dataset selection
- [ ] `dataSource/utils.ts` (100 lines) - Parsing, type inference
- [ ] `dataSource/parser/*` (5 files, 200 lines) - CSV/JSON parsers

### Week 3: Workflow (3 files) 🔴
- [ ] `utils/workflow.ts` (451 lines) - Workflow orchestration
- [ ] `lib/transform.ts` (200 lines) - Data transformations
- [ ] `lib/sql.ts` (776 lines) - SQL parsing, field replacement

**Phase 1 Total:** +35 files | 2,820 test lines | 199 tests

---

## Phase 2: Visualization (Weeks 4-6) → 35% Coverage

### Weeks 4-5: Vis Module (15 files) 🟡
- [ ] `vis/react-vega.tsx` (567 lines) - Vega-Lite spec generation
- [ ] `vis/observable-plot-renderer.tsx` (426 lines) - Observable Plot specs
- [ ] `vis/theme.ts` (357 lines) - Chart theming
- [ ] `lib/observablePlot.ts` (517 lines) - Plot utilities (expand existing 90 lines)
- [ ] `lib/vl2gw.ts` (436 lines) - Vega-Lite conversion
- [ ] `vis/spec/*` (5 files, 500 lines) - Chart type specs
- [ ] `vis/observable-spec/*` (5 files, 300 lines) - Observable specs

### Week 6: Visual Settings (2 files) 🟢
- [ ] `visualSettings/index.tsx` (692 lines) - Encoding settings
- [ ] `visualSettings/utils.ts` - Expand existing 18 lines

**Phase 2 Total:** +30 files | 2,850 test lines | 182 tests

---

## Phase 3: UI Components (Weeks 7-9) → 46% Coverage

### Week 7: Core Components (10 files) 🟡
- [ ] `components/painter/index.tsx` (1232 lines) - Drag-and-drop encoding
- [ ] `components/visualConfig/index.tsx` (715 lines) - Config panel
- [ ] `components/dataTable/index.tsx` (661 lines) - Data grid (expand existing 113 lines)
- [ ] `components/pivotTable/index.tsx` (292 lines) - Pivot table (expand existing 534 lines)
- [ ] `components/filterWalker/index.tsx` (406 lines) - Filter builder
- [ ] `components/filterContext/index.tsx` (333 lines) - Filter context

### Week 8: Renderers (5 files) 🟡
- [ ] `Renderer.tsx` (326 lines) - Main chart renderer
- [ ] `components/leafletRenderer/ChoroplethRenderer.tsx` (435 lines) - Maps
- [ ] `components/leafletRenderer/geoConfigPanel.tsx` (265 lines) - Geo config

### Week 9: Field Components (5 files) 🟡
- [ ] `fields/filterField/tabs.tsx` (999 lines) - Filter tabs
- [ ] `fields/filterField/simple.tsx` (475 lines) - Simple filters
- [ ] `fields/filterField/array.test.ts` - Expand existing 53 lines
- [ ] `fields/datasetFields/*` (5 files, 500 lines) - Field editors

**Phase 3 Total:** +25 files | 3,800 test lines | 228 tests

---

## Phase 4: Utilities (Weeks 10-12) → 50% Coverage ✅

### Weeks 10-11: Utilities (8 files) 🟢
- [ ] `utils/index.ts` (433 lines) - General utilities
- [ ] `utils/normalization.ts` - Expand existing 620 lines
- [ ] `utils/dataPrep.ts` (200 lines) - Data preparation
- [ ] `utils/colors.ts` (150 lines) - Color utilities
- [ ] `utils/chartIndexControl.ts` (100 lines) - Chart indexing
- [ ] `lib/viewQuery.ts` (150 lines) - Query operations

### Week 12: Models (2 files) 🟢
- [ ] `models/visSpecHistory.ts` (717 lines) - History management
- [ ] `interfaces.ts` (1183 lines) - Type guards

**Phase 4 Total:** +10 files | 1,600 test lines | 112 tests

---

## Summary by Phase

| Phase | Weeks | Files | Total Files | Coverage | Priority |
|-------|-------|-------|-------------|----------|----------|
| Current | - | 13 | 13 | 5.8% | - |
| Phase 1 | 1-3 | +35 | 48 | 21% | 🔴 CRITICAL |
| Phase 2 | 4-6 | +30 | 78 | 35% | 🟡 HIGH |
| Phase 3 | 7-9 | +25 | 103 | 46% | 🟡 HIGH |
| Phase 4 | 10-12 | +10 | 113 | **50%** | 🟢 MEDIUM |

---

## Top 10 Priority Files (Start Here)

1. 🔴 **`store/visualSpecStore.ts`** (900 lines) - All chart state
2. 🔴 **`utils/workflow.ts`** (451 lines) - Data pipeline orchestration
3. 🔴 **`lib/sql.ts`** (776 lines) - SQL parsing
4. 🔴 **`dataSource/index.tsx`** (280 lines) - Data loading
5. 🟡 **`components/painter/index.tsx`** (1232 lines) - Drag-and-drop
6. 🟡 **`vis/react-vega.tsx`** (567 lines) - Chart spec generation
7. 🟡 **`components/visualConfig/index.tsx`** (715 lines) - Config UI
8. 🟡 **`visualSettings/index.tsx`** (692 lines) - Visual settings
9. 🟡 **`fields/filterField/tabs.tsx`** (999 lines) - Filter UI
10. 🟢 **`models/visSpecHistory.ts`** (717 lines) - History management

---

## Quick Wins (Do First)

- [ ] **Set up coverage reporting in CI** (1 day)
- [ ] **Create test data generators** (2 days)
- [ ] **Add test utilities** (2 days)
- [ ] **Document testing patterns** (1 day)

---

## Quality Gates (Each Phase)

- ✅ All tests passing
- ✅ No linting/type errors
- ✅ Build succeeds
- ✅ Performance benchmarks met
- ✅ Code review completed

---

## Resource Requirements

- **Team:** 2-3 developers + 1 QA engineer
- **Timeline:** 12 weeks
- **Tools:** Jest, React Testing Library, MSW, Faker.js
- **Output:** 15,406 test lines, 870 tests, 50% coverage

---

**See COVERAGE_50_PERCENT_PLAN.md for full details**
