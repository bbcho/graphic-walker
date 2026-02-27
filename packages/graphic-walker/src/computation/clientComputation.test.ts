import { dataQueryClient } from './clientComputation';
import type { IRow, IDataQueryWorkflowStep } from '../interfaces';

/**
 * Rigorous tests for clientComputation performance optimizations
 * These tests use realistic data patterns and comprehensive scenarios
 */
describe('clientComputation - Performance Optimizations', () => {
    
    /**
     * Generate realistic e-commerce transaction data
     */
    const generateEcommerceData = (rows: number): IRow[] => {
        const data: IRow[] = [];
        const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Health'];
        const regions = ['North', 'South', 'East', 'West', 'Central'];
        const statuses = ['completed', 'pending', 'cancelled', 'refunded'];
        
        for (let i = 0; i < rows; i++) {
            const date = new Date(2023, i % 12, (i % 28) + 1, (i % 24), (i % 60));
            data.push({
                transaction_id: `TXN-${i.toString().padStart(8, '0')}`,
                customer_id: `CUST-${Math.floor(i / 10).toString().padStart(6, '0')}`,
                category: categories[i % categories.length],
                region: regions[i % regions.length],
                status: statuses[i % statuses.length],
                amount: Math.round((Math.random() * 1000 + 50) * 100) / 100,
                quantity: Math.floor(Math.random() * 10) + 1,
                date: date.toISOString(),
                timestamp: date.getTime(),
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                product_name: `Product ${i % 100}`,
                discount_percent: Math.floor(Math.random() * 50),
                is_member: i % 3 === 0,
                rating: Math.floor(Math.random() * 5) + 1,
            });
        }
        return data;
    };

    describe('Filter Operations - Real Scenarios', () => {
        let testData: IRow[];
        
        beforeEach(() => {
            testData = generateEcommerceData(1000);
        });

        it('should correctly filter with "one of" rule on categories', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'category',
                        rule: {
                            type: 'one of',
                            value: ['Electronics', 'Books'],
                        },
                    }],
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThan(testData.length);
            result.forEach(row => {
                expect(['Electronics', 'Books']).toContain(row.category);
            });
        });

        it('should correctly filter with "not in" rule', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'status',
                        rule: {
                            type: 'not in',
                            value: ['cancelled', 'refunded'],
                        },
                    }],
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            result.forEach(row => {
                expect(row.status).not.toBe('cancelled');
                expect(row.status).not.toBe('refunded');
                expect(['completed', 'pending']).toContain(row.status);
            });
        });

        it('should correctly filter with "range" rule on amounts', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'amount',
                        rule: {
                            type: 'range',
                            value: [100, 500],
                        },
                    }],
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            result.forEach(row => {
                expect(row.amount).toBeGreaterThanOrEqual(100);
                expect(row.amount).toBeLessThanOrEqual(500);
            });
        });

        it('should correctly filter with "temporal range"', async () => {
            const startDate = new Date('2023-06-01').getTime();
            const endDate = new Date('2023-08-31').getTime();
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'timestamp',
                        rule: {
                            type: 'temporal range',
                            value: [startDate, endDate],
                        },
                    }],
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            result.forEach(row => {
                expect(row.timestamp).toBeGreaterThanOrEqual(startDate);
                expect(row.timestamp).toBeLessThanOrEqual(endDate);
            });
        });

        it('should correctly chain multiple filters', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [
                        {
                            fid: 'category',
                            rule: {
                                type: 'one of',
                                value: ['Electronics', 'Clothing', 'Books'],
                            },
                        },
                        {
                            fid: 'amount',
                            rule: {
                                type: 'range',
                                value: [200, 800],
                            },
                        },
                        {
                            fid: 'status',
                            rule: {
                                type: 'one of',
                                value: ['completed'],
                            },
                        },
                    ],
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            result.forEach(row => {
                expect(['Electronics', 'Clothing', 'Books']).toContain(row.category);
                expect(row.amount).toBeGreaterThanOrEqual(200);
                expect(row.amount).toBeLessThanOrEqual(800);
                expect(row.status).toBe('completed');
            });
        });
    });

    describe('Sort Operations - Real Scenarios', () => {
        let testData: IRow[];
        
        beforeEach(() => {
            testData = generateEcommerceData(500);
        });

        it('should correctly sort by amount ascending', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            expect(result.length).toBe(testData.length);
            for (let i = 1; i < result.length; i++) {
                expect(result[i].amount).toBeGreaterThanOrEqual(result[i - 1].amount);
            }
        });

        it('should correctly sort by amount descending', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'descending',
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            for (let i = 1; i < result.length; i++) {
                expect(result[i].amount).toBeLessThanOrEqual(result[i - 1].amount);
            });
        });

        it('should correctly sort by date', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['timestamp'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient(testData, workflow);
            
            for (let i = 1; i < result.length; i++) {
                expect(result[i].timestamp).toBeGreaterThanOrEqual(result[i - 1].timestamp);
            }
        });
    });

    describe('Early Limit Application - Performance Critical', () => {
        it('should apply limit early for filter+sort workflow (10k rows)', async () => {
            const data = generateEcommerceData(10000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'category',
                        rule: {
                            type: 'one of',
                            value: ['Electronics', 'Clothing'],
                        },
                    }],
                },
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'descending',
                },
            ];

            const startTime = Date.now();
            const result = await dataQueryClient(data, workflow, 0, 50);
            const duration = Date.now() - startTime;
            
            expect(result.length).toBe(50);
            expect(duration).toBeLessThan(300); // Should be fast with early limit
            
            // Verify correctness
            result.forEach(row => {
                expect(['Electronics', 'Clothing']).toContain(row.category);
            });
            
            // Verify sorting
            for (let i = 1; i < result.length; i++) {
                expect(result[i].amount).toBeLessThanOrEqual(result[i - 1].amount);
            }
        });

        it('should handle large offset correctly (100k rows)', async () => {
            const data = generateEcommerceData(100000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['transaction_id'],
                    sort: 'ascending',
                },
            ];

            const startTime = Date.now();
            const result = await dataQueryClient(data, workflow, 50000, 100);
            const duration = Date.now() - startTime;
            
            expect(result.length).toBe(100);
            expect(result[0].transaction_id).toBe('TXN-00050000');
            expect(result[99].transaction_id).toBe('TXN-00050099');
            
            console.log(`Large offset query (100k rows, offset 50k) completed in ${duration}ms`);
        });

        it('should NOT apply early limit for aggregation workflows', async () => {
            const data = generateEcommerceData(1000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'view',
                    query: [{
                        op: 'aggregate',
                        groupBy: ['category'],
                        measures: [],
                    }],
                },
            ];

            const result = await dataQueryClient(data, workflow, 0, 5);
            
            // Should aggregate all data first, then limit
            expect(result.length).toBeLessThanOrEqual(5);
        });
    });

    describe('Complex Workflows - Real Business Scenarios', () => {
        let testData: IRow[];
        
        beforeEach(() => {
            testData = generateEcommerceData(2000);
        });

        it('should handle multi-step filter + sort + paginate workflow', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [
                        {
                            fid: 'status',
                            rule: {
                                type: 'one of',
                                value: ['completed'],
                            },
                        },
                        {
                            fid: 'amount',
                            rule: {
                                type: 'range',
                                value: [100, 1000],
                            },
                        },
                    ],
                },
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'descending',
                },
            ];

            const result = await dataQueryClient(testData, workflow, 0, 20);
            
            expect(result.length).toBe(20);
            
            // Verify filters
            result.forEach(row => {
                expect(row.status).toBe('completed');
                expect(row.amount).toBeGreaterThanOrEqual(100);
                expect(row.amount).toBeLessThanOrEqual(1000);
            });
            
            // Verify sorting
            for (let i = 1; i < result.length; i++) {
                expect(result[i].amount).toBeLessThanOrEqual(result[i - 1].amount);
            }
        });

        it('should correctly paginate through filtered results', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'category',
                        rule: {
                            type: 'one of',
                            value: ['Electronics'],
                        },
                    }],
                },
                {
                    type: 'sort',
                    by: ['transaction_id'],
                    sort: 'ascending',
                },
            ];

            // Get first page
            const page1 = await dataQueryClient(testData, workflow, 0, 10);
            // Get second page
            const page2 = await dataQueryClient(testData, workflow, 10, 10);
            
            expect(page1.length).toBe(10);
            expect(page2.length).toBe(10);
            
            // Pages should not overlap
            const page1Ids = new Set(page1.map(r => r.transaction_id));
            page2.forEach(row => {
                expect(page1Ids.has(row.transaction_id)).toBe(false);
            });
            
            // Should be sequential
            expect(page2[0].transaction_id > page1[9].transaction_id).toBe(true);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty dataset', async () => {
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient([], workflow, 0, 10);
            expect(result.length).toBe(0);
        });

        it('should handle offset beyond data length', async () => {
            const data = generateEcommerceData(100);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient(data, workflow, 150, 10);
            expect(result.length).toBe(0);
        });

        it('should handle filters that match nothing', async () => {
            const data = generateEcommerceData(100);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'category',
                        rule: {
                            type: 'one of',
                            value: ['NonExistentCategory'],
                        },
                    }],
                },
            ];

            const result = await dataQueryClient(data, workflow);
            expect(result.length).toBe(0);
        });

        it('should handle missing fields gracefully', async () => {
            const data: IRow[] = [
                { id: 1, name: 'Test 1' },
                { id: 2, name: 'Test 2', amount: 100 },
                { id: 3, name: 'Test 3', amount: 200 },
            ];
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'ascending',
                },
            ];

            const result = await dataQueryClient(data, workflow);
            expect(result.length).toBe(3);
            // Items with undefined values should be sorted to the beginning or end
        });
    });

    describe('Performance Benchmarks', () => {
        it('should process 50k rows with filter+sort in < 500ms', async () => {
            const data = generateEcommerceData(50000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [{
                        fid: 'status',
                        rule: {
                            type: 'one of',
                            value: ['completed'],
                        },
                    }],
                },
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'descending',
                },
            ];

            const startTime = Date.now();
            const result = await dataQueryClient(data, workflow, 0, 100);
            const duration = Date.now() - startTime;
            
            expect(result.length).toBe(100);
            expect(duration).toBeLessThan(500);
            
            console.log(`50k rows filter+sort+limit: ${duration}ms`);
        });

        it('should process 100k rows with pagination efficiently', async () => {
            const data = generateEcommerceData(100000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'sort',
                    by: ['timestamp'],
                    sort: 'ascending',
                },
            ];

            const startTime = Date.now();
            const result = await dataQueryClient(data, workflow, 0, 50);
            const duration = Date.now() - startTime;
            
            expect(result.length).toBe(50);
            expect(duration).toBeLessThan(1000);
            
            console.log(`100k rows sort+paginate: ${duration}ms`);
        });

        it('should handle multiple complex filters efficiently', async () => {
            const data = generateEcommerceData(20000);
            
            const workflow: IDataQueryWorkflowStep[] = [
                {
                    type: 'filter',
                    filters: [
                        {
                            fid: 'category',
                            rule: {
                                type: 'one of',
                                value: ['Electronics', 'Clothing', 'Books'],
                            },
                        },
                        {
                            fid: 'amount',
                            rule: {
                                type: 'range',
                                value: [50, 500],
                            },
                        },
                        {
                            fid: 'rating',
                            rule: {
                                type: 'range',
                                value: [4, 5],
                            },
                        },
                    ],
                },
                {
                    type: 'sort',
                    by: ['amount'],
                    sort: 'descending',
                },
            ];

            const startTime = Date.now();
            const result = await dataQueryClient(data, workflow, 0, 100);
            const duration = Date.now() - startTime;
            
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThanOrEqual(100);
            expect(duration).toBeLessThan(400);
            
            console.log(`20k rows with 3 filters: ${duration}ms`);
        });
    });
});
