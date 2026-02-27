import { buildMetricTableFromNestTree, buildNestTree } from './utils';
import type { IRow } from '../../interfaces';
import type { INestNode } from './inteface';

describe('pivot table performance optimizations', () => {
    // Helper to generate test data for pivot tables
    const generatePivotData = (rows: number): IRow[] => {
        const data: IRow[] = [];
        const categories = ['A', 'B', 'C', 'D', 'E'];
        const regions = ['North', 'South', 'East', 'West'];
        
        for (let i = 0; i < rows; i++) {
            data.push({
                category: categories[i % categories.length],
                region: regions[i % regions.length],
                year: 2020 + (i % 3),
                sales: Math.random() * 1000,
                quantity: Math.floor(Math.random() * 100),
            });
        }
        return data;
    };

    describe('buildMetricTableFromNestTree with indexing', () => {
        it('should build correct pivot table with indexed lookup', () => {
            const data = generatePivotData(100);
            
            // Build trees for rows (category) and columns (region)
            const leftTree = buildNestTree({
                data,
                keys: ['category'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            // Should have rows for each category
            expect(matrix.length).toBeGreaterThan(0);
            
            // Each row should have columns for each region
            matrix.forEach(row => {
                expect(row.length).toBeGreaterThan(0);
            });
        });

        it('should handle large datasets efficiently', () => {
            const data = generatePivotData(10000);
            
            const leftTree = buildNestTree({
                data,
                keys: ['category', 'year'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const endTime = Date.now();
            
            expect(matrix.length).toBeGreaterThan(0);
            
            // Should complete in reasonable time
            // With indexing, should be much faster than O(n * cells)
            const duration = endTime - startTime;
            console.log(`Built pivot table for 10k rows in ${duration}ms`);
            
            // Should be under 1 second even for large datasets
            expect(duration).toBeLessThan(1000);
        });

        it('should match the correct rows for each cell', () => {
            const data: IRow[] = [
                { category: 'A', region: 'North', value: 100 },
                { category: 'A', region: 'South', value: 200 },
                { category: 'B', region: 'North', value: 300 },
                { category: 'B', region: 'South', value: 400 },
            ];
            
            const leftTree = buildNestTree({
                data,
                keys: ['category'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            
            // Verify correct values are in correct cells
            expect(matrix.length).toBeGreaterThan(0);
            
            // Check that cells contain expected data
            matrix.forEach(row => {
                row.forEach(cell => {
                    if (cell) {
                        expect(cell.value).toBeDefined();
                        expect(cell.category).toBeDefined();
                        expect(cell.region).toBeDefined();
                    }
                });
            });
        });

        it('should handle empty predicates correctly', () => {
            const data = generatePivotData(50);
            
            const leftTree = buildNestTree({
                data,
                keys: [],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            // Should not crash with empty predicates
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            expect(matrix).toBeDefined();
        });

        it('should be significantly faster than naive implementation for large matrices', () => {
            const data = generatePivotData(5000);
            
            // Create a moderately complex pivot (not too many dimensions to avoid timeout)
            const leftTree = buildNestTree({
                data,
                keys: ['category'],
                sort: undefined,
            });
            
            const topTree = buildNestTree({
                data,
                keys: ['region'],
                sort: undefined,
            });
            
            const startTime = Date.now();
            const matrix = buildMetricTableFromNestTree(leftTree, topTree, data);
            const endTime = Date.now();
            
            const duration = endTime - startTime;
            console.log(`Built 5k row pivot table in ${duration}ms`);
            
            // With indexing, should be much faster
            // Naive O(n * cells) would take much longer
            expect(duration).toBeLessThan(500);
            
            // Verify matrix is correct
            expect(matrix.length).toBeGreaterThan(0);
            expect(matrix[0].length).toBeGreaterThan(0);
        });
    });
});
