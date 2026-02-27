# 🎯 Plan to Achieve 50% Test Coverage

**Current State:** 5.8% file coverage (13/226 files)  
**Target:** 50% file coverage (113/226 files)  
**Gap:** Need **100 more test files**

**Date Created:** February 27, 2026  
**Estimated Timeline:** 8-12 weeks with dedicated effort

---

## 📊 Current Coverage by Module

| Module | Files | Tests | Coverage | Lines | Priority |
|--------|-------|-------|----------|-------|----------|
| **store** | 7 | 0 | 0% | 1,258 | 🔴 CRITICAL |
| **vis** | 15 | 0 | 0% | 2,133 | 🔴 CRITICAL |
| **dataSource** | 11 | 0 | 0% | 808 | 🟡 HIGH |
| **components** | 95 | 2 | 2% | 11,284 | 🟡 HIGH |
| **fields** | 22 | 1 | 4% | 3,363 | 🟡 HIGH |
| **utils** | 15 | 1 | 6% | 1,987 | 🟢 MEDIUM |
| **lib** | 23 | 5 | 21% | 3,519 | 🟢 MEDIUM |
| **visualSettings** | 3 | 1 | 33% | 727 | 🟢 LOW |
| **models** | 5 | 2 | 40% | 1,240 | 🟢 LOW |
| **computation** | 2 | 1 | 50% | 722 | ✅ DONE |

---

## 🚀 Strategic Roadmap

### Phase 1: Critical Core (Weeks 1-3) 
**Target: +35 test files → 48 total (21% coverage)**

Focus on business-critical state management and data flow.

#### 1.1 Store Module (7 files) - Week 1 🔴
**Why Critical:** All application state flows through these modules. Bugs here affect everything.

- [ ] **`store/visualSpecStore.ts`** (900 lines) ⭐ **HIGHEST PRIORITY**
  - Visual specification CRUD operations
  - Chart type state transitions
  - Encoding channel management
  - Field drag-and-drop state
  - Undo/redo operations
  - **Est. 400 lines, 25 tests**

- [ ] **`store/dataStore.ts`** (~200 lines)
  - Data loading and caching
  - Dataset switching
  - Data transformation pipeline
  - **Est. 200 lines, 15 tests**

- [ ] **`store/commonStore.ts`** (~150 lines)
  - UI state (sidebar, panels, modals)
  - User preferences
  - Configuration management
  - **Est. 150 lines, 10 tests**

- [ ] **`store/theme.ts`** (~100 lines)
  - Theme switching
  - Color scheme management
  - Dark mode support
  - **Est. 100 lines, 8 tests**

- [ ] **`store/storeStateLib.ts`** (~100 lines)
  - State serialization/deserialization
  - State migration utilities
  - **Est. 100 lines, 8 tests**

- [ ] **`store/context.ts`** (~50 lines)
  - React context setup
  - Store provider testing
  - **Est. 50 lines, 5 tests**

- [ ] **`store/index.tsx`** (~50 lines)
  - Store initialization
  - Root store composition
  - **Est. 50 lines, 5 tests**

**Phase 1.1 Subtotal:** 1,050 test lines, 76 tests

#### 1.2 Data Source Module (11 files) - Week 2 🔴
**Why Critical:** Foundation of all data operations. Bad data = broken app.

- [ ] **`dataSource/index.tsx`** (280 lines)
  - File upload handling
  - Data format detection (CSV, JSON, Arrow)
  - Sample data loading
  - **Est. 250 lines, 15 tests**

- [ ] **`dataSource/config.tsx`** (~150 lines)
  - Data source configuration
  - Connection settings
  - **Est. 120 lines, 10 tests**

- [ ] **`dataSource/selection.tsx`** (~100 lines)
  - Dataset selection UI logic
  - Multi-dataset support
  - **Est. 100 lines, 8 tests**

- [ ] **`dataSource/utils.ts`** (~100 lines)
  - Data parsing utilities
  - Type inference
  - Schema detection
  - **Est. 150 lines, 12 tests**

- [ ] **`dataSource/parser/*`** (5 files, ~200 lines)
  - CSV parser
  - JSON parser
  - Data validation
  - **Est. 200 lines, 15 tests**

**Phase 1.2 Subtotal:** 820 test lines, 60 tests

#### 1.3 Workflow Module - Week 3 🔴
**Why Critical:** Orchestrates data transformations. Bugs corrupt data pipeline.

- [ ] **`utils/workflow.ts`** (451 lines) ⭐ **2nd HIGHEST PRIORITY**
  - Workflow step creation
  - Filter/transform/aggregate chains
  - Step dependencies and validation
  - Workflow serialization
  - **Est. 400 lines, 25 tests**

- [ ] **`lib/transform.ts`** (~200 lines)
  - Data transformation functions
  - Field calculations
  - Aggregations
  - **Est. 250 lines, 18 tests**

- [ ] **`lib/sql.ts`** (776 lines)
  - SQL query parsing
  - Field name replacement
  - Query validation
  - **Est. 300 lines, 20 tests**

**Phase 1.3 Subtotal:** 950 test lines, 63 tests

**PHASE 1 TOTAL:** 2,820 test lines, 199 tests, +35 test files

---

### Phase 2: Visualization Core (Weeks 4-6)
**Target: +30 test files → 78 total (35% coverage)**

Focus on chart rendering and specification generation.

#### 2.1 Vis Module (15 files) - Weeks 4-5 🟡

- [ ] **`vis/react-vega.tsx`** (567 lines)
  - Vega-Lite spec generation
  - Chart type mappings
  - Encoding transformations
  - **Est. 400 lines, 25 tests**

- [ ] **`vis/observable-plot-renderer.tsx`** (426 lines)
  - Observable Plot spec generation
  - Mark type selection
  - Scale configuration
  - **Est. 350 lines, 20 tests**

- [ ] **`vis/theme.ts`** (357 lines)
  - Theme application to charts
  - Color palette management
  - Font and styling
  - **Est. 250 lines, 15 tests**

- [ ] **`lib/observablePlot.ts`** (517 lines)
  - Observable Plot utilities (PARTIALLY TESTED - 90 lines exist)
  - Mark generators
  - Transform functions
  - **Est. 300 more lines, 20 tests**

- [ ] **`lib/vl2gw.ts`** (436 lines)
  - Vega-Lite to Graphic Walker conversion
  - Spec migration
  - Backwards compatibility
  - **Est. 350 lines, 22 tests**

- [ ] **`vis/spec/*`** (5 files, ~500 lines)
  - Spec builders for each chart type
  - Channel mappings
  - Default configurations
  - **Est. 400 lines, 25 tests**

- [ ] **`vis/observable-spec/*`** (5 files, ~300 lines)
  - Observable-specific specs
  - Mark configurations
  - **Est. 250 lines, 18 tests**

**Phase 2.1 Subtotal:** 2,300 test lines, 145 tests

#### 2.2 Visual Settings (2 files) - Week 6 🟢

- [ ] **`visualSettings/index.tsx`** (692 lines)
  - Visual encoding settings
  - Axis configuration
  - Legend settings
  - Color scheme selection
  - **Est. 400 lines, 25 tests**

- [ ] **`visualSettings/utils.ts`** (PARTIALLY TESTED - 18 lines exist)
  - Settings utilities
  - Configuration validation
  - **Est. 150 more lines, 12 tests**

**Phase 2.2 Subtotal:** 550 test lines, 37 tests

**PHASE 2 TOTAL:** 2,850 test lines, 182 tests, +30 test files

---

### Phase 3: UI Components (Weeks 7-9)
**Target: +25 test files → 103 total (46% coverage)**

Focus on critical user-facing components.

#### 3.1 Core Components (10 files) - Week 7 🟡

- [ ] **`components/painter/index.tsx`** (1232 lines) ⭐ **LARGEST FILE**
  - Drag-and-drop field encoding
  - Channel configuration
  - Visual encoding shelf
  - **Est. 500 lines, 30 tests**

- [ ] **`components/visualConfig/index.tsx`** (715 lines)
  - Visual configuration panel
  - Chart type selection
  - Settings management
  - **Est. 350 lines, 20 tests**

- [ ] **`components/dataTable/index.tsx`** (661 lines)
  - Data grid rendering (PARTIALLY TESTED - 113 lines exist)
  - Sorting/filtering UI
  - Cell rendering
  - **Est. 300 more lines, 18 tests**

- [ ] **`components/pivotTable/index.tsx`** (292 lines)
  - Pivot table rendering (PARTIALLY TESTED - 534 lines exist)
  - Row/column expansion
  - **Est. 150 more lines, 12 tests**

- [ ] **`components/filterWalker/index.tsx`** (406 lines)
  - Filter builder UI
  - Filter conditions
  - Multi-filter management
  - **Est. 300 lines, 18 tests**

- [ ] **`components/filterContext/index.tsx`** (333 lines)
  - Filter context management
  - Filter application
  - **Est. 250 lines, 15 tests**

**Phase 3.1 Subtotal:** 1,850 test lines, 113 tests

#### 3.2 Renderer Components (5 files) - Week 8 🟡

- [ ] **`Renderer.tsx`** (326 lines)
  - Main chart renderer
  - Chart type dispatch
  - Error boundaries
  - **Est. 250 lines, 15 tests**

- [ ] **`components/leafletRenderer/ChoroplethRenderer.tsx`** (435 lines)
  - Choropleth map rendering
  - GeoJSON handling
  - Map interactions
  - **Est. 300 lines, 18 tests**

- [ ] **`components/leafletRenderer/geoConfigPanel.tsx`** (265 lines)
  - Geographic data configuration
  - Map layer settings
  - **Est. 200 lines, 12 tests**

**Phase 3.2 Subtotal:** 750 test lines, 45 tests

#### 3.3 Field Components (5 files) - Week 9 🟡

- [ ] **`fields/filterField/tabs.tsx`** (999 lines)
  - Filter tabs UI
  - Filter type selection
  - **Est. 400 lines, 22 tests**

- [ ] **`fields/filterField/simple.tsx`** (475 lines)
  - Simple filter UI
  - Value selection
  - **Est. 300 lines, 18 tests**

- [ ] **`fields/filterField/array.test.ts`** (PARTIALLY TESTED - 53 lines exist)
  - Array utilities
  - **Est. 150 more lines, 10 tests**

- [ ] **`fields/datasetFields/*`** (5 files, ~500 lines)
  - Field type components
  - Field editor
  - **Est. 350 lines, 20 tests**

**Phase 3.3 Subtotal:** 1,200 test lines, 70 tests

**PHASE 3 TOTAL:** 3,800 test lines, 228 tests, +25 test files

---

### Phase 4: Utilities & Polish (Weeks 10-12)
**Target: +10 test files → 113 total (50% coverage)**

Complete remaining utilities and edge cases.

#### 4.1 Utility Functions (8 files) - Weeks 10-11 🟢

- [ ] **`utils/index.ts`** (433 lines)
  - General utility functions
  - Data helpers
  - **Est. 300 lines, 20 tests**

- [ ] **`utils/normalization.ts`** (PARTIALLY TESTED - 620 lines exist)
  - Additional normalization scenarios
  - **Est. 200 more lines, 12 tests**

- [ ] **`utils/dataPrep.ts`** (~200 lines)
  - Data preparation utilities
  - Type conversions
  - **Est. 200 lines, 15 tests**

- [ ] **`utils/colors.ts`** (~150 lines)
  - Color manipulation
  - Palette generation
  - **Est. 150 lines, 12 tests**

- [ ] **`utils/chartIndexControl.ts`** (~100 lines)
  - Chart indexing
  - Multi-chart management
  - **Est. 100 lines, 8 tests**

- [ ] **`lib/viewQuery.ts`** (~150 lines)
  - View query operations
  - Query optimization
  - **Est. 150 lines, 12 tests**

**Phase 4.1 Subtotal:** 1,100 test lines, 79 tests

#### 4.2 Models & Interfaces (2 files) - Week 12 🟢

- [ ] **`models/visSpecHistory.ts`** (717 lines)
  - Visual spec history management
  - History navigation
  - **Est. 300 lines, 18 tests**

- [ ] **`interfaces.ts`** (1183 lines)
  - Type validation helpers
  - Interface guards
  - **Est. 200 lines, 15 tests**

**Phase 4.2 Subtotal:** 500 test lines, 33 tests

**PHASE 4 TOTAL:** 1,600 test lines, 112 tests, +10 test files

---

## 📈 Cumulative Progress Tracker

| Phase | Weeks | Test Files | Cumulative Files | Coverage | Test Lines | Tests |
|-------|-------|------------|------------------|----------|------------|-------|
| **Current** | - | 13 | 13 | 5.8% | 4,336 | 149 |
| **Phase 1** | 1-3 | +35 | 48 | 21% | 7,156 | 348 |
| **Phase 2** | 4-6 | +30 | 78 | 35% | 10,006 | 530 |
| **Phase 3** | 7-9 | +25 | 103 | 46% | 13,806 | 758 |
| **Phase 4** | 10-12 | +10 | 113 | **50%** | **15,406** | **870** |

---

## 🎯 Success Metrics

### Quantitative Goals
- ✅ **50% file coverage** (113/226 files tested)
- ✅ **15,406 lines** of test code
- ✅ **870+ test cases** across all modules
- ✅ All critical paths covered (store, vis, workflow)

### Qualitative Goals
- ✅ Realistic test data (real business scenarios)
- ✅ Performance benchmarks included
- ✅ Edge cases documented
- ✅ Integration tests for critical flows
- ✅ Mock strategies for external dependencies

---

## 🛠️ Implementation Guidelines

### Test Structure Standards

```typescript
describe('ModuleName', () => {
    describe('FunctionName', () => {
        it('should handle normal case', () => {
            // Arrange: Setup realistic data
            const input = createRealisticTestData();
            
            // Act: Execute function
            const result = functionUnderTest(input);
            
            // Assert: Verify behavior
            expect(result).toMatchExpectedOutput();
        });

        it('should handle edge case: null values', () => {
            // Test boundary conditions
        });

        it('should handle edge case: empty input', () => {
            // Test edge cases
        });

        it('should perform within acceptable time', () => {
            // Performance benchmark
            const start = Date.now();
            processLargeDataset(10000);
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(100);
        });
    });
});
```

### Test Data Patterns

**Use Realistic Business Data:**
```typescript
const sampleProducts = [
    {
        id: 'P001',
        name: 'Wireless Mouse',
        category: 'Electronics',
        price: 29.99,
        stock: 150,
        rating: 4.5,
        lastSold: '2024-02-15'
    },
    // More realistic entries...
];
```

**Not:**
```typescript
const testData = [
    { a: 1, b: 2 },
    { a: 3, b: 4 }
];
```

### Coverage Targets by Module Type

| Module Type | Line Coverage | Branch Coverage | Function Coverage |
|-------------|---------------|-----------------|-------------------|
| **Store/State** | 80%+ | 75%+ | 90%+ |
| **Data Pipeline** | 85%+ | 80%+ | 90%+ |
| **Visualization** | 70%+ | 65%+ | 80%+ |
| **UI Components** | 60%+ | 55%+ | 70%+ |
| **Utilities** | 85%+ | 80%+ 90%+ |

---

## 📋 Phase 1 Detailed Action Items (Weeks 1-3)

### Week 1: Store Module
**Monday-Tuesday: visualSpecStore.ts**
- [ ] Test chart type state management
- [ ] Test encoding channel updates
- [ ] Test field drag-and-drop logic
- [ ] Test undo/redo operations
- [ ] Test state persistence

**Wednesday: dataStore.ts**
- [ ] Test data loading
- [ ] Test dataset switching
- [ ] Test data caching
- [ ] Test transformation pipeline

**Thursday: commonStore.ts + theme.ts**
- [ ] Test UI state management
- [ ] Test theme switching
- [ ] Test user preferences

**Friday: storeStateLib.ts + context.ts + index.tsx**
- [ ] Test state serialization
- [ ] Test store initialization
- [ ] Test context providers

### Week 2: Data Source Module
**Monday-Tuesday: dataSource/index.tsx**
- [ ] Test file upload handling
- [ ] Test format detection
- [ ] Test sample data loading

**Wednesday: config.tsx + selection.tsx**
- [ ] Test data source configuration
- [ ] Test dataset selection

**Thursday: utils.ts**
- [ ] Test data parsing
- [ ] Test type inference
- [ ] Test schema detection

**Friday: parser/* files**
- [ ] Test CSV parser
- [ ] Test JSON parser
- [ ] Test data validation

### Week 3: Workflow Module
**Monday-Wednesday: utils/workflow.ts**
- [ ] Test workflow creation
- [ ] Test step chaining
- [ ] Test step validation
- [ ] Test workflow serialization

**Thursday: lib/transform.ts**
- [ ] Test data transformations
- [ ] Test field calculations
- [ ] Test aggregations

**Friday: lib/sql.ts**
- [ ] Test SQL parsing
- [ ] Test field replacement
- [ ] Test query validation

---

## 🔍 Risk Mitigation

### High-Risk Areas Requiring Extra Attention

1. **State Management (Store)**
   - Risk: Complex state transitions, race conditions
   - Mitigation: Use state machine testing, property-based tests
   
2. **Data Pipeline (Workflow)**
   - Risk: Data corruption, memory leaks with large datasets
   - Mitigation: Performance benchmarks, memory profiling
   
3. **Visualization (Vis)**
   - Risk: Rendering bugs, spec generation errors
   - Mitigation: Snapshot testing, visual regression tests

4. **Async Operations**
   - Risk: Race conditions, promise rejections
   - Mitigation: Use fake timers, test error handlers

---

## 🚦 Quality Gates

Each phase must meet these criteria before proceeding:

### Phase Exit Criteria
- ✅ All planned test files created
- ✅ All tests passing
- ✅ Code review completed
- ✅ Performance benchmarks met
- ✅ Edge cases documented
- ✅ Integration tests passing

### Continuous Requirements
- ✅ No new linting errors
- ✅ No new type errors
- ✅ Build succeeds
- ✅ Existing tests still passing
- ✅ Code coverage not decreased

---

## 📚 Resources Needed

### Tools
- [ ] Jest with coverage reporting
- [ ] React Testing Library for components
- [ ] MSW (Mock Service Worker) for API mocking
- [ ] Faker.js for realistic test data
- [ ] jest-performance for benchmarks

### Documentation
- [ ] Testing guidelines document
- [ ] Test data generators library
- [ ] Mock factory patterns
- [ ] CI/CD pipeline for automated testing

### Team Allocation (Estimated)
- **2-3 developers** working in parallel
- **1 QA engineer** for test review
- **1 tech lead** for architecture guidance

---

## 🎉 Expected Outcomes

### After Phase 1 (Week 3)
- 21% coverage
- Critical state management tested
- Data loading validated
- Workflow pipeline secure

### After Phase 2 (Week 6)
- 35% coverage
- All chart types tested
- Visualization rendering validated
- Spec generation verified

### After Phase 3 (Week 9)
- 46% coverage
- Core UI components tested
- User interactions validated
- Component integration verified

### After Phase 4 (Week 12)
- **50% coverage achieved** ✅
- Comprehensive test suite
- Automated testing pipeline
- Documentation complete

---

## 📊 Monitoring & Reporting

### Weekly Metrics
- Test files created this week
- Cumulative coverage percentage
- Tests passing/failing
- Performance benchmarks
- Bugs found and fixed

### Bi-Weekly Reviews
- Team retrospective
- Blockers and challenges
- Adjust timeline if needed
- Celebrate milestones

---

## 🔄 Maintenance Plan

### After Reaching 50%
- [ ] Establish coverage floor (no PRs that decrease coverage)
- [ ] Add pre-commit hooks for testing
- [ ] Set up coverage badges in README
- [ ] Create testing guidelines for new features
- [ ] Schedule quarterly test suite audits

---

## 💡 Quick Wins (Can Start Immediately)

These can be done in parallel with the main phases:

1. **Add coverage reporting to CI/CD** (1 day)
   - Configure Jest coverage thresholds
   - Add coverage to GitHub Actions
   - Set up coverage badges

2. **Create test data generators** (2 days)
   - Product catalog generator
   - User activity generator
   - Sales transaction generator
   - Time series generator

3. **Set up testing utilities** (2 days)
   - Mock store factory
   - Test render helpers
   - Assertion utilities
   - Performance test helpers

4. **Document testing patterns** (1 day)
   - Store testing patterns
   - Component testing patterns
   - Integration testing patterns
   - Performance testing patterns

---

## 📝 Summary

**To achieve 50% coverage:**
- Add **100 new test files** over **12 weeks**
- Write **~11,000 lines** of new test code
- Create **~720 new test cases**
- Focus on **critical business logic first**
- Use **realistic test data throughout**

**Prioritization:**
1. 🔴 **Week 1-3:** Store, DataSource, Workflow (CRITICAL)
2. 🟡 **Week 4-6:** Vis, Visual Settings (HIGH)
3. 🟡 **Week 7-9:** UI Components (HIGH)
4. 🟢 **Week 10-12:** Utilities, Polish (MEDIUM)

**Success Factors:**
- Dedicated team of 2-3 developers
- Management buy-in for test-focused sprints
- Clear quality gates between phases
- Continuous integration feedback
- Regular reviews and adjustments

---

**Status:** Planning Complete - Ready for Implementation  
**Next Step:** Begin Phase 1, Week 1 - Store Module Testing  
**Owner:** Development Team  
**Last Updated:** February 27, 2026
