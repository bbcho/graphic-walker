import { dataQueryClient } from '../clientComputation';
import type { IRow, IDataQueryWorkflowStep } from '../../interfaces';

describe('clientComputation performance optimizations', () => {
    // Helper to generate test data
    const generateData = (rows: number): IRow[] => {
        const data: IRow[] = [];
        for (let i = 0; i < rows; i++) {
            data.push({
                id: i,
                category: `cat_${i % 10}`,
                value: Math.random() * 100,
                name: `Item ${i}`,
            });
        }
        return data;
    };

    describe('early limit application', () => {
        it('should apply limit early for simple filter+sort queries', async () => {
            const data = generateData(1000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'category',
                        rule: {
                            type: 'one of',
                            value: ['cat_1', 'cat_2', 'cat_3'],
                        },
                    }],
                },
                {
                    type: 'sort',
                    by: ['value'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient(data, workflow, 0, 10);
            
            // Should return exactly 10 items
            expect(result.length).toBe(10);
            
            // Should be sorted by value
            for (let i = 1; i < result.length; i++) {
                expect(result[i].value).toBeGreaterThanOrEqual(result[i - 1].value);
            }
            
            // Should only include filtered categories
            result.forEach(row => {
                expect(['cat_1', 'cat_2', 'cat_3']).toContain(row.category);
            });
        });

        it('should not apply early limit for queries with aggregation', async () => {
            const data = generateData(100);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'view',
                    query: [{
                        op: 'aggregate',
                        groupBy: ['category'],
                        measures: [{ field: 'value', agg: 'sum', asFieldKey: 'total' }],
                    }],
                },
            ];

            const result = await dataQueryClient(data, workflow, 0, 5);
            
            // Should return limited results after aggregation
            expect(result.length).toBeLessThanOrEqual(5);
        });

        it('should handle offset correctly', async () => {
            const data = generateData(100);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['id'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient(data, workflow, 10, 5);
            
            // Should return 5 items starting from offset 10
            expect(result.length).toBe(5);
            expect(result[0].id).toBe(10);
            expect(result[4].id).toBe(14);
        });
    });

    describe('performance', () => {
        it('should process large dataset efficiently with pagination', async () => {
            const data = generateData(10000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['value'],
                    sort: 'ascending',
                },
            ];

            const startTime = Date.now();
            const result = await dataQueryClient(data, workflow, 0, 100);
            const endTime = Date.now();
            
            expect(result.length).toBe(100);
            
            // Should complete in reasonable time (less than 500ms for this size)
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(500);
            
            console.log(`Processed 10k rows with pagination in ${duration}ms`);
        });
    });
});
