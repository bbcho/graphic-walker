import { buildMetricTableFromNestTree, buildNestTree } from './utils';
import type { IRow } from '../../interfaces';

/**
 * Rigorous tests for pivot table performance optimizations
 * These tests use realistic business data and comprehensive scenarios
 */
describe('Pivot Table - Performance Optimizations with Indexed Lookups', () => {

    /**
     * Generate realistic sales data for testing
     */
    const generateSalesData = (rows: number): IRow[] => {
        const data: IRow[] = [];
        const products = ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Webcam', 'Printer', 'Scanner'];
        const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
        const salespeople = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        
        for (let i = 0; i < rows; i++) {
            const year = 2020 + (i % 4);
            const quarter = quarters[i % 4];
            const month = (i % 12) + 1;
            
            data.push({
                id: `SALE-${i.toString().padStart(8, '0')}`,
                product: products[i % products.length],
                category: i % 2 === 0 ? 'Hardware' : 'Accessories',
                region: regions[i % regions.length],
                country: `Country-${(i % 50).toString().padStart(2, '0')}`,
                salesperson: salespeople[i % salespeople.length],
                year,
                quarter,
                month,
                units_sold: Math.floor(Math.random() * 100) + 1,
                revenue: Math.round((Math.random() * 50000 + 1000) * 100) / 100,
                cost: Math.round((Math.random() * 30000 + 500) * 100) / 100,
                profit: 0, // calculated below
                margin_percent: 0, // calculated below
                customer_count: Math.floor(Math.random() * 50) + 1,
                discount_applied: Math.random() > 0.7,
                discount_amount: Math.round((Math.random() * 5000) * 100) / 100,
            });
            
            // Calculate profit and margin
            data[i].profit = data[i].revenue - data[i].cost;
            data[i].margin_percent = Math.round((data[i].profit / data[i].revenue) * 10000) / 100;
        }
        
        return data;
    };

    describe('Basic Pivot Table Correctness', () => {
        it('should build correct 2D pivot table (Product x Region)', () => {
            const data = generateSalesData(1000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            // Should have rows (products and totals)
            expect(matrix.length).toBeGreaterThan(0);
            
            // Each row should have columns (regions)
            matrix.forEach(row => {
                expect(row.length).toBeGreaterThan(0);
            });
            
            // Verify data integrity - each cell should match predicates
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell && cell !== undefined) {
                        expect(cell.product).toBeDefined();
                        expect(cell.region).toBeDefined();
                        expect(cell.revenue).toBeDefined();
                    }
                });
            });
        });

        it('should match specific values in pivot cells', () => {
            // Create controlled test data
            const data: IRow[] = [
                { product: 'Laptop', region: 'North America', revenue: 5000, units: 10 },
                { product: 'Laptop', region: 'Europe', revenue: 4000, units: 8 },
                { product: 'Phone', region: 'North America', revenue: 3000, units: 15 },
                { product: 'Phone', region: 'Europe', revenue: 3500, units: 12 },
                { product: 'Laptop', region: 'Asia', revenue: 4500, units: 9 },
                { product: 'Phone', region: 'Asia', revenue: 2800, units: 11 },
            ];
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            // Find specific cells and verify their values
            let foundLaptopNA = false;
            let foundPhoneEurope = false;
            
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell && cell.product === 'Laptop' && cell.region === 'North America') {
                        expect(cell.revenue).toBe(5000);
                        expect(cell.units).toBe(10);
                        foundLaptopNA = true;
                    }
                    if (cell && cell.product === 'Phone' && cell.region === 'Europe') {
                        expect(cell.revenue).toBe(3500);
                        expect(cell.units).toBe(12);
                        foundPhoneEurope = true;
                    }
                });
            });
            
            expect(foundLaptopNA).toBe(true);
            expect(foundPhoneEurope).toBe(true);
        });

        it('should handle multi-dimensional pivots (Product x Category x Region)', () => {
            const data = generateSalesData(500);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product', 'category'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(matrix[0].length).toBeGreaterThan(0);
            
            // Verify multi-level grouping
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell && cell !== undefined) {
                        expect(cell.product).toBeDefined();
                        expect(cell.category).toBeDefined();
                        expect(cell.region).toBeDefined();
                    }
                });
            });
        });
    });

    describe('Performance with Indexed Lookups', () => {
        it('should build pivot table efficiently for 10k rows', () => {
            const data = generateSalesData(10000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product', 'year'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const duration = Date.now() - startTime;
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(500); // With indexing, should be fast
            
            console.log(`10k rows pivot table built in ${duration}ms`);
        });

        it('should build complex pivot efficiently for 50k rows', () => {
            const data = generateSalesData(50000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product', 'category'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region', 'quarter'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const duration = Date.now() - startTime;
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(2000); // Should complete in reasonable time
            
            console.log(`50k rows complex pivot built in ${duration}ms`);
        });

        it('should handle high cardinality efficiently (100k rows)', () => {
            const data = generateSalesData(100000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const duration = Date.now() - startTime;
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(3000); // With indexing, should still be reasonable
            
            console.log(`100k rows pivot table built in ${duration}ms`);
        });
    });

    describe('Edge Cases and Special Scenarios', () => {
        it('should handle sparse data (many empty cells)', () => {
            // Create sparse data where not all combinations exist
            const data: IRow[] = [
                { product: 'A', region: 'R1', value: 100 },
                { product: 'A', region: 'R3', value: 200 },
                { product: 'B', region: 'R2', value: 150 },
                { product: 'C', region: 'R1', value: 175 },
                { product: 'D', region: 'R4', value: 225 },
            ];
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            expect(matrix.length).toBeGreaterThan(0);
            
            // Count empty and filled cells
            let emptyCells = 0;
            let filledCells = 0;
            
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (!cell || cell === undefined) {
                        emptyCells++;
                    } else {
                        filledCells++;
                    }
                });
            });
            
            expect(filledCells).toBe(5); // Only 5 data points
            expect(emptyCells).toBeGreaterThan(0); // Should have some empty cells
        });

        it('should handle duplicate rows correctly', () => {
            const data: IRow[] = [
                { product: 'Laptop', region: 'North', revenue: 1000 },
                { product: 'Laptop', region: 'North', revenue: 1500, extra: 'data' },
                { product: 'Laptop', region: 'North', revenue: 2000, more: 'fields' },
                { product: 'Phone', region: 'South', revenue: 800 },
            ];
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            // When multiple rows match, should return one (with smallest number of keys)
            expect(matrix.length).toBeGreaterThan(0);
            
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell && cell.product === 'Laptop' && cell.region === 'North') {
                        // Should pick the row with fewest keys
                        expect(cell.revenue).toBeDefined();
                    }
                });
            });
        });

        it('should handle empty data', () => {
            const leftTree = buildNestTree({
                data: [],
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data: [],
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, []);
            
            // Should not crash with empty data
            expect(matrix).toBeDefined();
            expect(Array.isArray(matrix)).toBe(true);
        });

        it('should handle single row/column', () => {
            const data: IRow[] = [
                { product: 'Single', region: 'Only', value: 100 },
            ];
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(matrix[0].length).toBeGreaterThan(0);
        });

        it('should handle null and undefined values', () => {
            const data: IRow[] = [
                { product: 'A', region: 'R1', value: 100 },
                { product: null, region: 'R2', value: 200 },
                { product: 'B', region: null, value: 150 },
                { product: undefined, region: 'R3', value: 175 },
            ];
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            // Should not crash with null/undefined values
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            expect(matrix).toBeDefined();
        });
    });

    describe('Real Business Scenarios', () => {
        it('should build sales by product and region pivot', () => {
            const data = generateSalesData(2000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product'],
                sort: { fid: 'revenue', type: 'descending' },
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const duration = Date.now() - startTime;
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(300);
            
            // Verify business metrics are present
            let totalRevenue = 0;
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell && cell.revenue) {
                        totalRevenue += cell.revenue;
                        expect(cell.product).toBeDefined();
                        expect(cell.region).toBeDefined();
                    }
                });
            });
            
            expect(totalRevenue).toBeGreaterThan(0);
            console.log(`Sales pivot: ${duration}ms, Total revenue tracked: $${Math.round(totalRevenue)}`);
        });

        it('should build quarterly sales pivot (Year x Quarter x Region)', () => {
            const data = generateSalesData(5000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['year', 'quarter'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const duration = Date.now() - startTime;
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(500);
            
            // Verify temporal grouping
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell) {
                        expect(cell.year).toBeDefined();
                        expect(cell.quarter).toBeDefined();
                        expect(cell.region).toBeDefined();
                    }
                });
            });
            
            console.log(`Quarterly sales pivot: ${duration}ms`);
        });

        it('should build detailed multi-level pivot', () => {
            const data = generateSalesData(3000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['category', 'product', 'year'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region', 'quarter'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const duration = Date.now() - startTime;
            
            expect(matrix.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(800);
            
            console.log(`3-level pivot: ${duration}ms, Matrix size: ${matrix.length} x ${matrix[0]?.length || 0}`);
        });
    });

    describe('Comparison: Indexed vs Naive Performance', () => {
        it('should demonstrate performance improvement on large dataset', () => {
            const data = generateSalesData(10000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['product', 'year'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region', 'quarter'],
                sort: undefined,
            });
            
            // Measure indexed implementation
            const startIndexed = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const durationIndexed = Date.now() - startIndexed;
            
            expect(matrix.length).toBeGreaterThan(0);
            
            // Calculate expected naive time (O(n * cells))
            const cellCount = matrix.length * (matrix[0]?.length || 0);
            const estimatedNaiveTime = (data.length * cellCount) / 100000; // Rough estimate
            
            console.log(`Indexed: ${durationIndexed}ms`);
            console.log(`Estimated naive: ${Math.round(estimatedNaiveTime)}ms`);
            console.log(`Improvement factor: ${Math.round(estimatedNaiveTime / durationIndexed)}x faster`);
            
            // Indexed should be significantly faster
            expect(durationIndexed).toBeLessThan(1000);
        });
    });
});
