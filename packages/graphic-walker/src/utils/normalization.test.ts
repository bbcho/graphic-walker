import {
    normalizeWithParent,
    compareDistribution,
    compareDistributionKL,
    compareDistributionJS,
    normalizeByMeasures,
    getDistributionDifference,
    makeBinField,
    makeLogField,
} from './normalization';
import type { IRow } from '../interfaces';

/**
 * Rigorous tests for data normalization and distribution comparison utilities
 * These functions are critical for data analysis and visualization
 */
describe('Data Normalization and Distribution Utilities', () => {

    describe('normalizeWithParent', () => {
        it('should normalize data relative to parent totals', () => {
            const parentData: IRow[] = [
                { category: 'A', sales: 100, profit: 50 },
                { category: 'B', sales: 200, profit: 100 },
                { category: 'C', sales: 300, profit: 150 },
            ];
            
            const childData: IRow[] = [
                { category: 'A', product: 'X', sales: 40, profit: 20 },
                { category: 'A', product: 'Y', sales: 60, profit: 30 },
            ];
            
            const result = normalizeWithParent(
                childData,
                parentData,
                ['sales', 'profit'],
                true // syncScale with parent
            );
            
            // Parent total: sales=600, profit=300
            expect(result.normalizedParentData.length).toBe(3);
            expect(result.normalizedData.length).toBe(2);
            
            // Check parent normalization
            expect(result.normalizedParentData[0].sales).toBeCloseTo(100 / 600);
            expect(result.normalizedParentData[1].sales).toBeCloseTo(200 / 600);
            expect(result.normalizedParentData[0].profit).toBeCloseTo(50 / 300);
            
            // Check child normalization (syncScale=true, uses parent totals)
            expect(result.normalizedData[0].sales).toBeCloseTo(40 / 600);
            expect(result.normalizedData[1].sales).toBeCloseTo(60 / 600);
            expect(result.normalizedData[0].profit).toBeCloseTo(20 / 300);
        });

        it('should normalize data independently when syncScale is false', () => {
            const parentData: IRow[] = [
                { region: 'North', revenue: 1000 },
            ];
            
            const childData: IRow[] = [
                { region: 'North', city: 'A', revenue: 300 },
                { region: 'North', city: 'B', revenue: 700 },
            ];
            
            const result = normalizeWithParent(
                childData,
                parentData,
                ['revenue'],
                false // independent scaling
            );
            
            // Parent normalized to its own total (1000)
            expect(result.normalizedParentData[0].revenue).toBeCloseTo(1);
            
            // Child normalized to child total (1000)
            expect(result.normalizedData[0].revenue).toBeCloseTo(0.3);
            expect(result.normalizedData[1].revenue).toBeCloseTo(0.7);
        });

        it('should handle negative values using absolute values', () => {
            const parentData: IRow[] = [
                { item: 'A', value: 100 },
                { item: 'B', value: -50 },
            ];
            
            const childData: IRow[] = [
                { item: 'A', subitem: 'X', value: 60 },
                { item: 'B', subitem: 'Y', value: -30 },
            ];
            
            const result = normalizeWithParent(
                childData,
                parentData,
                ['value'],
                true
            );
            
            // Parent total: |100| + |-50| = 150
            expect(result.normalizedParentData[0].value).toBeCloseTo(100 / 150);
            expect(result.normalizedParentData[1].value).toBeCloseTo(-50 / 150);
            
            // Child normalized using parent total
            expect(result.normalizedData[0].value).toBeCloseTo(60 / 150);
            expect(result.normalizedData[1].value).toBeCloseTo(-30 / 150);
        });

        it('should handle multiple measures simultaneously', () => {
            const parentData: IRow[] = [
                { category: 'X', metric1: 100, metric2: 200, metric3: 50 },
            ];
            
            const childData: IRow[] = [
                { category: 'X', subcategory: 'A', metric1: 30, metric2: 80, metric3: 15 },
                { category: 'X', subcategory: 'B', metric1: 70, metric2: 120, metric3: 35 },
            ];
            
            const result = normalizeWithParent(
                childData,
                parentData,
                ['metric1', 'metric2', 'metric3'],
                true
            );
            
            // Each measure normalized independently
            expect(result.normalizedData[0].metric1).toBeCloseTo(30 / 100);
            expect(result.normalizedData[0].metric2).toBeCloseTo(80 / 200);
            expect(result.normalizedData[0].metric3).toBeCloseTo(15 / 50);
            
            expect(result.normalizedData[1].metric1).toBeCloseTo(70 / 100);
            expect(result.normalizedData[1].metric2).toBeCloseTo(120 / 200);
            expect(result.normalizedData[1].metric3).toBeCloseTo(35 / 50);
        });

        it('should preserve non-measure fields', () => {
            const parentData: IRow[] = [
                { id: 1, name: 'Parent', value: 100 },
            ];
            
            const childData: IRow[] = [
                { id: 2, name: 'Child A', parentId: 1, value: 60, extra: 'data' },
                { id: 3, name: 'Child B', parentId: 1, value: 40, extra: 'info' },
            ];
            
            const result = normalizeWithParent(
                childData,
                parentData,
                ['value'],
                true
            );
            
            // Non-measure fields preserved
            expect(result.normalizedData[0].id).toBe(2);
            expect(result.normalizedData[0].name).toBe('Child A');
            expect(result.normalizedData[0].extra).toBe('data');
            expect(result.normalizedData[1].extra).toBe('info');
        });
    });

    describe('compareDistribution', () => {
        it('should compare matching distributions correctly', () => {
            const dist1: IRow[] = [
                { category: 'A', count: 0.3 },
                { category: 'B', count: 0.5 },
                { category: 'C', count: 0.2 },
            ];
            
            const dist2: IRow[] = [
                { category: 'A', count: 0.3 },
                { category: 'B', count: 0.5 },
                { category: 'C', count: 0.2 },
            ];
            
            const score = compareDistribution(dist1, dist2, ['category'], ['count']);
            
            // Identical distributions should have score = 1
            expect(score).toBeCloseTo(1, 5);
        });

        it('should detect differences in distributions', () => {
            const dist1: IRow[] = [
                { category: 'A', value: 0.1 },
                { category: 'B', value: 0.9 },
            ];
            
            const dist2: IRow[] = [
                { category: 'A', value: 0.9 },
                { category: 'B', value: 0.1 },
            ];
            
            const score = compareDistribution(dist1, dist2, ['category'], ['value']);
            
            // Very different distributions should have high score
            expect(score).toBeGreaterThan(5);
        });

        it('should handle missing categories', () => {
            const dist1: IRow[] = [
                { category: 'A', value: 0.5 },
                { category: 'B', value: 0.3 },
                { category: 'C', value: 0.2 },
            ];
            
            const dist2: IRow[] = [
                { category: 'A', value: 0.6 },
                { category: 'B', value: 0.4 },
                // C is missing
            ];
            
            const score = compareDistribution(dist1, dist2, ['category'], ['value']);
            
            // Should handle missing categories
            expect(score).toBeGreaterThan(0);
            expect(score).toBeDefined();
        });

        it('should handle multiple dimensions', () => {
            const dist1: IRow[] = [
                { category: 'A', region: 'North', sales: 100 },
                { category: 'A', region: 'South', sales: 150 },
                { category: 'B', region: 'North', sales: 200 },
            ];
            
            const dist2: IRow[] = [
                { category: 'A', region: 'North', sales: 110 },
                { category: 'A', region: 'South', sales: 145 },
                { category: 'B', region: 'North', sales: 190 },
            ];
            
            const score = compareDistribution(
                dist1,
                dist2,
                ['category', 'region'],
                ['sales']
            );
            
            // Similar distributions should have low score
            expect(score).toBeGreaterThan(1);
            expect(score).toBeLessThan(2);
        });

        it('should handle multiple measures', () => {
            const dist1: IRow[] = [
                { type: 'X', metric1: 100, metric2: 50 },
                { type: 'Y', metric1: 200, metric2: 100 },
            ];
            
            const dist2: IRow[] = [
                { type: 'X', metric1: 105, metric2: 48 },
                { type: 'Y', metric1: 195, metric2: 102 },
            ];
            
            const score = compareDistribution(
                dist1,
                dist2,
                ['type'],
                ['metric1', 'metric2']
            );
            
            // Small differences should result in low score
            expect(score).toBeGreaterThan(1);
            expect(score).toBeLessThan(1.5);
        });
    });

    describe('normalizeByMeasures', () => {
        it('should normalize each measure to sum to 1', () => {
            const data: IRow[] = [
                { id: 1, sales: 100, profit: 20 },
                { id: 2, sales: 200, profit: 30 },
                { id: 3, sales: 300, profit: 50 },
            ];
            
            const normalized = normalizeByMeasures(data, ['sales', 'profit']);
            
            // Sales sum: 600, Profit sum: 100
            expect(normalized[0].sales).toBeCloseTo(100 / 600);
            expect(normalized[1].sales).toBeCloseTo(200 / 600);
            expect(normalized[2].sales).toBeCloseTo(300 / 600);
            
            expect(normalized[0].profit).toBeCloseTo(20 / 100);
            expect(normalized[1].profit).toBeCloseTo(30 / 100);
            expect(normalized[2].profit).toBeCloseTo(50 / 100);
            
            // Sum of each measure should be 1
            const salesSum = normalized.reduce((sum, r) => sum + r.sales, 0);
            const profitSum = normalized.reduce((sum, r) => sum + r.profit, 0);
            expect(salesSum).toBeCloseTo(1, 5);
            expect(profitSum).toBeCloseTo(1, 5);
        });

        it('should use absolute values for normalization', () => {
            const data: IRow[] = [
                { id: 1, value: 100 },
                { id: 2, value: -50 },
                { id: 3, value: 50 },
            ];
            
            const normalized = normalizeByMeasures(data, ['value']);
            
            // Total: |100| + |-50| + |50| = 200
            expect(normalized[0].value).toBeCloseTo(100 / 200);
            expect(normalized[1].value).toBeCloseTo(-50 / 200);
            expect(normalized[2].value).toBeCloseTo(50 / 200);
        });

        it('should preserve non-measure fields', () => {
            const data: IRow[] = [
                { id: 1, name: 'Item A', value: 100, category: 'X' },
                { id: 2, name: 'Item B', value: 200, category: 'Y' },
            ];
            
            const normalized = normalizeByMeasures(data, ['value']);
            
            expect(normalized[0].id).toBe(1);
            expect(normalized[0].name).toBe('Item A');
            expect(normalized[0].category).toBe('X');
            expect(normalized[1].name).toBe('Item B');
        });
    });

    describe('makeBinField', () => {
        it('should create bins for continuous data', () => {
            const data: IRow[] = [
                { id: 1, age: 25 },
                { id: 2, age: 35 },
                { id: 3, age: 45 },
                { id: 4, age: 55 },
                { id: 5, age: 65 },
            ];
            
            const binned = makeBinField(data, 'age', 'ageBin', 2);
            
            expect(binned.length).toBe(5);
            
            // Each row should have ageBin field
            binned.forEach(row => {
                expect(row.ageBin).toBeDefined();
                expect(Array.isArray(row.ageBin)).toBe(true);
                expect(row.ageBin.length).toBe(2);
            });
            
            // Bins should cover the range
            const allBins = binned.map(r => r.ageBin);
            const minBinStart = Math.min(...allBins.map(b => b[0]));
            const maxBinEnd = Math.max(...allBins.map(b => b[1]));
            
            expect(minBinStart).toBeLessThanOrEqual(25);
            expect(maxBinEnd).toBeGreaterThanOrEqual(65);
        });

        it('should create default 10 bins when binSize not specified', () => {
            const data: IRow[] = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                value: i * 10,
            }));
            
            const binned = makeBinField(data, 'value', 'valueBin');
            
            // Should create bins
            const uniqueBins = new Set(binned.map(r => JSON.stringify(r.valueBin)));
            expect(uniqueBins.size).toBeLessThanOrEqual(10);
        });

        it('should handle single value edge case', () => {
            const data: IRow[] = [
                { id: 1, value: 100 },
                { id: 2, value: 100 },
                { id: 3, value: 100 },
            ];
            
            const binned = makeBinField(data, 'value', 'valueBin', 5);
            
            // All values in same bin
            expect(binned[0].valueBin).toBeDefined();
            binned.forEach(row => {
                expect(row.valueBin[0]).toBe(binned[0].valueBin[0]);
            });
        });

        it('should preserve original fields', () => {
            const data: IRow[] = [
                { id: 1, name: 'A', score: 75, category: 'X' },
                { id: 2, name: 'B', score: 85, category: 'Y' },
            ];
            
            const binned = makeBinField(data, 'score', 'scoreBin', 2);
            
            expect(binned[0].id).toBe(1);
            expect(binned[0].name).toBe('A');
            expect(binned[0].score).toBe(75);
            expect(binned[0].category).toBe('X');
            expect(binned[0].scoreBin).toBeDefined();
        });

        it('should handle edge values correctly', () => {
            const data: IRow[] = [
                { value: 0 },
                { value: 50 },
                { value: 100 },
            ];
            
            const binned = makeBinField(data, 'value', 'bin', 2);
            
            // Min value should be in first bin
            expect(binned[0].bin[0]).toBeLessThanOrEqual(0);
            
            // Max value should be in last bin
            const maxBin = binned[2].bin;
            expect(maxBin[1]).toBeGreaterThanOrEqual(100);
        });
    });

    describe('makeLogField', () => {
        it('should compute log10 for positive values', () => {
            const data: IRow[] = [
                { id: 1, value: 1 },
                { id: 2, value: 10 },
                { id: 3, value: 100 },
                { id: 4, value: 1000 },
            ];
            
            const logged = makeLogField(data, 'value', 'logValue');
            
            expect(logged[0].logValue).toBeCloseTo(0, 5); // log10(1) = 0
            expect(logged[1].logValue).toBeCloseTo(1, 5); // log10(10) = 1
            expect(logged[2].logValue).toBeCloseTo(2, 5); // log10(100) = 2
            expect(logged[3].logValue).toBeCloseTo(3, 5); // log10(1000) = 3
        });

        it('should return null for zero values', () => {
            const data: IRow[] = [
                { id: 1, value: 0 },
                { id: 2, value: 10 },
            ];
            
            const logged = makeLogField(data, 'value', 'logValue');
            
            expect(logged[0].logValue).toBeNull();
            expect(logged[1].logValue).toBeCloseTo(1, 5);
        });

        it('should return null for negative values', () => {
            const data: IRow[] = [
                { id: 1, value: -10 },
                { id: 2, value: -100 },
            ];
            
            const logged = makeLogField(data, 'value', 'logValue');
            
            expect(logged[0].logValue).toBeNull();
            expect(logged[1].logValue).toBeNull();
        });

        it('should return null for non-numeric values', () => {
            const data: IRow[] = [
                { id: 1, value: 'text' },
                { id: 2, value: null },
                { id: 3, value: undefined },
                { id: 4, value: 100 },
            ];
            
            const logged = makeLogField(data, 'value', 'logValue');
            
            expect(logged[0].logValue).toBeNull();
            expect(logged[1].logValue).toBeNull();
            expect(logged[2].logValue).toBeNull();
            expect(logged[3].logValue).toBeCloseTo(2, 5);
        });

        it('should preserve original fields', () => {
            const data: IRow[] = [
                { id: 1, name: 'Item A', value: 100, category: 'X' },
                { id: 2, name: 'Item B', value: 1000, category: 'Y' },
            ];
            
            const logged = makeLogField(data, 'value', 'logValue');
            
            expect(logged[0].id).toBe(1);
            expect(logged[0].name).toBe('Item A');
            expect(logged[0].value).toBe(100);
            expect(logged[0].category).toBe('X');
            expect(logged[0].logValue).toBeCloseTo(2, 5);
            expect(logged[1].logValue).toBeCloseTo(3, 5);
        });

        it('should handle decimal values correctly', () => {
            const data: IRow[] = [
                { value: 0.1 },
                { value: 0.01 },
                { value: 0.001 },
            ];
            
            const logged = makeLogField(data, 'value', 'log');
            
            expect(logged[0].log).toBeCloseTo(-1, 5); // log10(0.1) = -1
            expect(logged[1].log).toBeCloseTo(-2, 5); // log10(0.01) = -2
            expect(logged[2].log).toBeCloseTo(-3, 5); // log10(0.001) = -3
        });
    });

    describe('getDistributionDifference', () => {
        it('should calculate difference between two measures', () => {
            const data: IRow[] = [
                { category: 'A', measure1: 0.3, measure2: 0.3 },
                { category: 'B', measure1: 0.5, measure2: 0.4 },
                { category: 'C', measure1: 0.2, measure2: 0.3 },
            ];
            
            const diff = getDistributionDifference(
                data,
                ['category'],
                'measure1',
                'measure2'
            );
            
            // Should be sum of max/min ratios
            expect(diff).toBeGreaterThan(0);
            expect(diff).toBeDefined();
        });

        it('should handle identical measures', () => {
            const data: IRow[] = [
                { type: 'X', m1: 0.5, m2: 0.5 },
                { type: 'Y', m1: 0.5, m2: 0.5 },
            ];
            
            const diff = getDistributionDifference(data, ['type'], 'm1', 'm2');
            
            // Identical measures: ratio = 1 for each row
            expect(diff).toBeCloseTo(2, 5); // 1 + 1
        });

        it('should skip zero values', () => {
            const data: IRow[] = [
                { id: 1, m1: 0.5, m2: 0.5 },
                { id: 2, m1: 0, m2: 0.5 },  // m1 is 0
                { id: 3, m1: 0.5, m2: 0 },  // m2 is 0
                { id: 4, m1: 0.3, m2: 0.3 },
            ];
            
            const diff = getDistributionDifference(data, ['id'], 'm1', 'm2');
            
            // Should only count non-zero pairs
            expect(diff).toBeCloseTo(2, 5); // 1 + 1 from first and last rows
        });
    });

    describe('Real-World Business Scenarios', () => {
        it('should normalize market share data for comparison', () => {
            const parentMarket: IRow[] = [
                { segment: 'Enterprise', revenue: 5000000, customers: 100 },
                { segment: 'SMB', revenue: 3000000, customers: 500 },
                { segment: 'Startup', revenue: 2000000, customers: 1000 },
            ];
            
            const ourCompany: IRow[] = [
                { segment: 'Enterprise', revenue: 500000, customers: 10 },
                { segment: 'SMB', revenue: 600000, customers: 100 },
                { segment: 'Startup', revenue: 400000, customers: 200 },
            ];
            
            const result = normalizeWithParent(
                ourCompany,
                parentMarket,
                ['revenue', 'customers'],
                true
            );
            
            // Calculate market share
            const enterpriseShare = result.normalizedData[0].revenue;
            const smbShare = result.normalizedData[1].revenue;
            
            expect(enterpriseShare).toBeCloseTo(500000 / 10000000);
            expect(smbShare).toBeCloseTo(600000 / 10000000);
        });

        it('should bin age data for demographics analysis', () => {
            const customers: IRow[] = Array.from({ length: 100 }, (_, i) => ({
                customerId: `CUST-${i}`,
                age: 18 + Math.floor(Math.random() * 62), // 18-80
                spend: Math.random() * 1000,
            }));
            
            const binned = makeBinField(customers, 'age', 'ageGroup', 5);
            
            // Group into 5 age brackets
            const ageGroups = new Set(binned.map(c => JSON.stringify(c.ageGroup)));
            expect(ageGroups.size).toBeLessThanOrEqual(5);
            
            // All original data preserved
            expect(binned.length).toBe(100);
            binned.forEach(c => {
                expect(c.customerId).toBeDefined();
                expect(c.age).toBeDefined();
                expect(c.spend).toBeDefined();
                expect(c.ageGroup).toBeDefined();
            });
        });

        it('should create log scale for revenue data', () => {
            const companies: IRow[] = [
                { name: 'Startup A', revenue: 100000 },
                { name: 'Growth B', revenue: 1000000 },
                { name: 'Enterprise C', revenue: 10000000 },
                { name: 'Corporation D', revenue: 100000000 },
            ];
            
            const logged = makeLogField(companies, 'revenue', 'logRevenue');
            
            // Log scale makes the range more manageable
            expect(logged[0].logRevenue).toBeCloseTo(5, 2); // 10^5
            expect(logged[1].logRevenue).toBeCloseTo(6, 2); // 10^6
            expect(logged[2].logRevenue).toBeCloseTo(7, 2); // 10^7
            expect(logged[3].logRevenue).toBeCloseTo(8, 2); // 10^8
            
            // Range in log scale: 3 orders of magnitude
            const logRange = logged[3].logRevenue - logged[0].logRevenue;
            expect(logRange).toBeCloseTo(3, 1);
        });
    });
});
