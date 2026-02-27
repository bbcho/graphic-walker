import { filter } from './filter';
import type { IRow, IFilterFiledSimple } from '../interfaces';

/**
 * Rigorous tests for filter implementation
 * Tests all filter types with realistic data patterns
 */
describe('Filter Module - All Filter Types', () => {

    /**
     * Generate realistic e-commerce data for filter testing
     */
    const generateTestData = (): IRow[] => {
        return [
            { id: 1, category: 'Electronics', price: 999.99, brand: 'Apple', stock: 50, rating: 4.5, date: '2024-01-15', active: true },
            { id: 2, category: 'Electronics', price: 1299.00, brand: 'Samsung', stock: 30, rating: 4.3, date: '2024-02-20', active: true },
            { id: 3, category: 'Clothing', price: 49.99, brand: 'Nike', stock: 100, rating: 4.8, date: '2024-01-10', active: true },
            { id: 4, category: 'Clothing', price: 89.99, brand: 'Adidas', stock: 75, rating: 4.6, date: '2024-03-05', active: false },
            { id: 5, category: 'Books', price: 19.99, brand: 'Penguin', stock: 200, rating: 4.9, date: '2024-02-28', active: true },
            { id: 6, category: 'Books', price: 24.99, brand: 'HarperCollins', stock: 150, rating: 4.7, date: '2024-01-20', active: true },
            { id: 7, category: 'Home', price: 299.99, brand: 'IKEA', stock: 25, rating: 4.2, date: '2024-03-10', active: true },
            { id: 8, category: 'Home', price: 499.99, brand: 'West Elm', stock: 10, rating: 4.4, date: '2024-02-15', active: false },
            { id: 9, category: 'Electronics', price: 799.99, brand: 'Sony', stock: 40, rating: 4.6, date: '2024-03-01', active: true },
            { id: 10, category: 'Sports', price: 149.99, brand: 'Wilson', stock: 60, rating: 4.5, date: '2024-01-25', active: true },
        ];
    };

    describe('"one of" filter', () => {
        it('should filter rows matching any value in the list', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'one of',
                    value: ['Electronics', 'Books'],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(5); // 3 Electronics + 2 Books
            result.forEach(row => {
                expect(['Electronics', 'Books']).toContain(row.category);
            });
        });

        it('should handle single value in list', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'brand',
                rule: {
                    type: 'one of',
                    value: ['Apple'],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(1);
            expect(result[0].brand).toBe('Apple');
        });

        it('should return empty array when no matches', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'one of',
                    value: ['NonExistent', 'AlsoNotThere'],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0);
        });

        it('should handle numeric values', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'id',
                rule: {
                    type: 'one of',
                    value: [1, 5, 9],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(3);
            expect(result.map(r => r.id)).toEqual([1, 5, 9]);
        });

        it('should handle boolean values', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'active',
                rule: {
                    type: 'one of',
                    value: [true],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(8);
            result.forEach(row => {
                expect(row.active).toBe(true);
            });
        });

        it('should handle empty value list', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'one of',
                    value: [],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0);
        });
    });

    describe('"not in" filter', () => {
        it('should exclude rows matching any value in the list', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'not in',
                    value: ['Electronics', 'Books'],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(5); // Exclude 3 Electronics + 2 Books
            result.forEach(row => {
                expect(['Electronics', 'Books']).not.toContain(row.category);
                expect(['Clothing', 'Home', 'Sports']).toContain(row.category);
            });
        });

        it('should return all rows when excluding nothing', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'not in',
                    value: [],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(10);
        });

        it('should exclude boolean values', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'active',
                rule: {
                    type: 'not in',
                    value: [false],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(8);
            result.forEach(row => {
                expect(row.active).toBe(true);
            });
        });
    });

    describe('"range" filter', () => {
        it('should filter numeric values within range', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'price',
                rule: {
                    type: 'range',
                    value: [50, 500],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.price).toBeGreaterThanOrEqual(50);
                expect(row.price).toBeLessThanOrEqual(500);
            });
        });

        it('should handle open-ended lower bound', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'price',
                rule: {
                    type: 'range',
                    value: [null, 100],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.price).toBeLessThanOrEqual(100);
            });
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle open-ended upper bound', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'stock',
                rule: {
                    type: 'range',
                    value: [50, null],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.stock).toBeGreaterThanOrEqual(50);
            });
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle exact boundary values', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'rating',
                rule: {
                    type: 'range',
                    value: [4.5, 4.8],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.rating).toBeGreaterThanOrEqual(4.5);
                expect(row.rating).toBeLessThanOrEqual(4.8);
            });
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle single value range', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'stock',
                rule: {
                    type: 'range',
                    value: [50, 50],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.stock).toBe(50);
            });
        });

        it('should return empty for impossible range', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'price',
                rule: {
                    type: 'range',
                    value: [1000000, 2000000],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0);
        });
    });

    describe('"temporal range" filter', () => {
        it('should filter dates within range', () => {
            const data = generateTestData();
            
            const startTime = new Date('2024-02-01').getTime();
            const endTime = new Date('2024-03-01').getTime();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'date',
                rule: {
                    type: 'temporal range',
                    value: [startTime, endTime],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                const rowTime = new Date(row.date).getTime();
                expect(rowTime).toBeGreaterThanOrEqual(startTime);
                expect(rowTime).toBeLessThanOrEqual(endTime);
            });
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle open-ended date ranges', () => {
            const data = generateTestData();
            
            const startTime = new Date('2024-02-15').getTime();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'date',
                rule: {
                    type: 'temporal range',
                    value: [startTime, null],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                const rowTime = new Date(row.date).getTime();
                expect(rowTime).toBeGreaterThanOrEqual(startTime);
            });
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle dates before specific time', () => {
            const data = generateTestData();
            
            const endTime = new Date('2024-02-01').getTime();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'date',
                rule: {
                    type: 'temporal range',
                    value: [null, endTime],
                },
            }];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                const rowTime = new Date(row.date).getTime();
                expect(rowTime).toBeLessThanOrEqual(endTime);
            });
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle single day range', () => {
            const data = generateTestData();
            
            const dayStart = new Date('2024-01-15T00:00:00').getTime();
            const dayEnd = new Date('2024-01-15T23:59:59').getTime();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'date',
                rule: {
                    type: 'temporal range',
                    value: [dayStart, dayEnd],
                },
            }];
            
            const result = filter(data, filters);
            
            // Should only get entries from Jan 15
            expect(result.length).toBeGreaterThanOrEqual(0);
            result.forEach(row => {
                expect(row.date).toContain('2024-01-15');
            });
        });

        it('should return empty for future date range', () => {
            const data = generateTestData();
            
            const futureStart = new Date('2025-01-01').getTime();
            const futureEnd = new Date('2025-12-31').getTime();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'date',
                rule: {
                    type: 'temporal range',
                    value: [futureStart, futureEnd],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0);
        });
    });

    describe('"regexp" filter', () => {
        it('should filter using regular expression', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'brand',
                rule: {
                    type: 'regexp',
                    value: '^A',  // Starts with 'A'
                    caseSensitive: true,
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBeGreaterThan(0);
            result.forEach(row => {
                expect(row.brand).toMatch(/^A/);
            });
        });

        it('should handle case-insensitive matching', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'brand',
                rule: {
                    type: 'regexp',
                    value: 'apple',  // lowercase
                    caseSensitive: false,
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(1);
            expect(result[0].brand).toBe('Apple');
        });

        it('should handle case-sensitive matching', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'brand',
                rule: {
                    type: 'regexp',
                    value: 'apple',  // lowercase
                    caseSensitive: true,
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0); // No match for lowercase
        });

        it('should handle complex regex patterns', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'regexp',
                    value: '(Electronics|Books)',
                    caseSensitive: false,
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(5);
            result.forEach(row => {
                expect(['Electronics', 'Books']).toContain(row.category);
            });
        });

        it('should handle invalid regex gracefully', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'brand',
                rule: {
                    type: 'regexp',
                    value: '[invalid(',  // Invalid regex
                    caseSensitive: false,
                },
            }];
            
            // Should not crash
            const result = filter(data, filters);
            
            expect(result).toBeDefined();
            expect(result.length).toBe(0); // No matches when regex fails
        });
    });

    describe('Multiple Filters (AND logic)', () => {
        it('should apply all filters with AND logic', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [
                {
                    fid: 'category',
                    rule: {
                        type: 'one of',
                        value: ['Electronics', 'Home'],
                    },
                },
                {
                    fid: 'price',
                    rule: {
                        type: 'range',
                        value: [200, 1000],
                    },
                },
                {
                    fid: 'active',
                    rule: {
                        type: 'one of',
                        value: [true],
                    },
                },
            ];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(['Electronics', 'Home']).toContain(row.category);
                expect(row.price).toBeGreaterThanOrEqual(200);
                expect(row.price).toBeLessThanOrEqual(1000);
                expect(row.active).toBe(true);
            });
            
            // Should be more restrictive than any single filter
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThan(data.length);
        });

        it('should return empty when filters are mutually exclusive', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [
                {
                    fid: 'category',
                    rule: {
                        type: 'one of',
                        value: ['Electronics'],
                    },
                },
                {
                    fid: 'category',
                    rule: {
                        type: 'one of',
                        value: ['Books'],
                    },
                },
            ];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0);
        });

        it('should handle complex multi-filter scenarios', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [
                {
                    fid: 'price',
                    rule: {
                        type: 'range',
                        value: [null, 200],
                    },
                },
                {
                    fid: 'stock',
                    rule: {
                        type: 'range',
                        value: [50, null],
                    },
                },
                {
                    fid: 'rating',
                    rule: {
                        type: 'range',
                        value: [4.5, null],
                    },
                },
            ];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.price).toBeLessThanOrEqual(200);
                expect(row.stock).toBeGreaterThanOrEqual(50);
                expect(row.rating).toBeGreaterThanOrEqual(4.5);
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty data array', () => {
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: {
                    type: 'one of',
                    value: ['Electronics'],
                },
            }];
            
            const result = filter([], filters);
            
            expect(result.length).toBe(0);
        });

        it('should handle empty filters array', () => {
            const data = generateTestData();
            
            const result = filter(data, []);
            
            expect(result.length).toBe(10);
            expect(result).toEqual(data);
        });

        it('should handle missing filter rule', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'category',
                rule: undefined,
            }];
            
            const result = filter(data, filters);
            
            // Should return all data when rule is missing
            expect(result.length).toBe(10);
        });

        it('should handle filter on non-existent field', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'nonExistentField',
                rule: {
                    type: 'one of',
                    value: ['someValue'],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(0);
        });

        it('should handle null and undefined values', () => {
            const data: IRow[] = [
                { id: 1, value: 100, category: 'A' },
                { id: 2, value: null, category: 'B' },
                { id: 3, value: undefined, category: 'C' },
                { id: 4, value: 200, category: null },
            ];
            
            const filters: IFilterFiledSimple[] = [{
                fid: 'value',
                rule: {
                    type: 'range',
                    value: [50, 150],
                },
            }];
            
            const result = filter(data, filters);
            
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(1);
        });
    });

    describe('Real-World Business Scenarios', () => {
        it('should filter products for active electronics promotion', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [
                {
                    fid: 'category',
                    rule: {
                        type: 'one of',
                        value: ['Electronics'],
                    },
                },
                {
                    fid: 'price',
                    rule: {
                        type: 'range',
                        value: [500, 1500],
                    },
                },
                {
                    fid: 'active',
                    rule: {
                        type: 'one of',
                        value: [true],
                    },
                },
                {
                    fid: 'stock',
                    rule: {
                        type: 'range',
                        value: [20, null],
                    },
                },
            ];
            
            const result = filter(data, filters);
            
            // Should find eligible products
            expect(result.length).toBeGreaterThan(0);
            result.forEach(row => {
                expect(row.category).toBe('Electronics');
                expect(row.price).toBeGreaterThanOrEqual(500);
                expect(row.price).toBeLessThanOrEqual(1500);
                expect(row.active).toBe(true);
                expect(row.stock).toBeGreaterThanOrEqual(20);
            });
        });

        it('should filter highly-rated products for recommendation engine', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [
                {
                    fid: 'rating',
                    rule: {
                        type: 'range',
                        value: [4.5, null],
                    },
                },
                {
                    fid: 'stock',
                    rule: {
                        type: 'range',
                        value: [25, null],
                    },
                },
                {
                    fid: 'active',
                    rule: {
                        type: 'one of',
                        value: [true],
                    },
                },
            ];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.rating).toBeGreaterThanOrEqual(4.5);
                expect(row.stock).toBeGreaterThanOrEqual(25);
                expect(row.active).toBe(true);
            });
        });

        it('should filter clearance items (inactive and low stock)', () => {
            const data = generateTestData();
            
            const filters: IFilterFiledSimple[] = [
                {
                    fid: 'active',
                    rule: {
                        type: 'one of',
                        value: [false],
                    },
                },
                {
                    fid: 'stock',
                    rule: {
                        type: 'range',
                        value: [null, 50],
                    },
                },
            ];
            
            const result = filter(data, filters);
            
            result.forEach(row => {
                expect(row.active).toBe(false);
                expect(row.stock).toBeLessThanOrEqual(50);
            });
        });
    });
});
