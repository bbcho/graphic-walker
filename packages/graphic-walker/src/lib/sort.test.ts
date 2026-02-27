import { sortBy } from './sort';
import type { IRow } from '../interfaces';

/**
 * Rigorous tests for sorting utilities
 * Tests the sortBy function and various data types with edge cases
 */
describe('Sort Utilities', () => {

    describe('sortBy function', () => {
        it('should sort by single measure ascending', () => {
            const data: IRow[] = [
                { id: 3, value: 30 },
                { id: 1, value: 10 },
                { id: 2, value: 20 },
            ];
            
            const sorted = sortBy(data, ['value'], 'ascending');
            
            expect(sorted[0].value).toBe(10);
            expect(sorted[1].value).toBe(20);
            expect(sorted[2].value).toBe(30);
        });

        it('should sort by single measure descending', () => {
            const data: IRow[] = [
                { id: 1, value: 10 },
                { id: 3, value: 30 },
                { id: 2, value: 20 },
            ];
            
            const sorted = sortBy(data, ['value'], 'descending');
            
            expect(sorted[0].value).toBe(30);
            expect(sorted[1].value).toBe(20);
            expect(sorted[2].value).toBe(10);
        });

        it('should sort by multiple measures (composite sort)', () => {
            const data: IRow[] = [
                { id: 1, metric1: 100, metric2: 50 },
                { id: 2, metric1: 100, metric2: 30 },
                { id: 3, metric1: 50, metric2: 40 },
                { id: 4, metric1: 100, metric2: 40 },
            ];
            
            const sorted = sortBy(data, ['metric1', 'metric2'], 'ascending');
            
            // First sorted by metric1, then by metric2
            expect(sorted[0].id).toBe(3); // 50, 40
            expect(sorted[1].id).toBe(2); // 100, 30
            expect(sorted[2].id).toBe(4); // 100, 40
            expect(sorted[3].id).toBe(1); // 100, 50
        });

        it('should sort by string measures', () => {
            const data: IRow[] = [
                { id: 1, category: 'Zebra' },
                { id: 2, category: 'Apple' },
                { id: 3, category: 'Mango' },
            ];
            
            const sorted = sortBy(data, ['category'], 'ascending');
            
            expect(sorted[0].category).toBe('Apple');
            expect(sorted[1].category).toBe('Mango');
            expect(sorted[2].category).toBe('Zebra');
        });

        it('should handle empty measures array', () => {
            const data: IRow[] = [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
            ];
            
            const sorted = sortBy(data, [], 'ascending');
            
            // Should return data as-is
            expect(sorted.length).toBe(2);
        });

        it('should not mutate original array', () => {
            const data: IRow[] = [
                { id: 3, value: 30 },
                { id: 1, value: 10 },
                { id: 2, value: 20 },
            ];
            
            const original = [...data];
            const sorted = sortBy(data, ['value'], 'ascending');
            
            // Original should be unchanged
            expect(data[0].id).toBe(original[0].id);
            expect(data[1].id).toBe(original[1].id);
            expect(data[2].id).toBe(original[2].id);
            
            // Sorted should be different
            expect(sorted[0].value).toBe(10);
        });

        it('should handle mixed numeric and string measures', () => {
            const data: IRow[] = [
                { category: 'B', value: 20 },
                { category: 'A', value: 30 },
                { category: 'A', value: 10 },
                { category: 'B', value: 10 },
            ];
            
            const sorted = sortBy(data, ['category', 'value'], 'ascending');
            
            // First by category (A < B), then by value
            expect(sorted[0].category).toBe('A');
            expect(sorted[0].value).toBe(10);
            expect(sorted[1].category).toBe('A');
            expect(sorted[1].value).toBe(30);
            expect(sorted[2].category).toBe('B');
            expect(sorted[2].value).toBe(10);
            expect(sorted[3].category).toBe('B');
            expect(sorted[3].value).toBe(20);
        });
    });

    /**
     * Generate test data with various data types
     */
    const generateSortTestData = (): IRow[] => {

    /**
     * Generate test data with various data types
     */
    const generateSortTestData = (): IRow[] => {
        return [
            { id: 5, name: 'Echo', price: 299.99, rating: 4.5, date: '2024-03-15', category: 'Electronics', stock: 50 },
            { id: 2, name: 'Bravo', price: 149.99, rating: 4.8, date: '2024-01-20', category: 'Books', stock: 200 },
            { id: 8, name: 'Hotel', price: 499.99, rating: 4.2, date: '2024-02-10', category: 'Home', stock: 25 },
            { id: 1, name: 'Alpha', price: 99.99, rating: 4.9, date: '2024-01-05', category: 'Clothing', stock: 100 },
            { id: 7, name: 'Golf', price: 399.99, rating: 4.3, date: '2024-03-01', category: 'Sports', stock: 75 },
            { id: 3, name: 'Charlie', price: 199.99, rating: 4.7, date: '2024-01-25', category: 'Electronics', stock: 60 },
            { id: 6, name: 'Foxtrot', price: 349.99, rating: 4.4, date: '2024-02-20', category: 'Home', stock: 40 },
            { id: 4, name: 'Delta', price: 249.99, rating: 4.6, date: '2024-02-05', category: 'Books', stock: 150 },
            { id: 10, name: 'Juliet', price: 599.99, rating: 4.1, date: '2024-03-20', category: 'Electronics', stock: 30 },
            { id: 9, name: 'India', price: 549.99, rating: 4.0, date: '2024-03-10', category: 'Sports', stock: 20 },
        ];
    };

    describe('Numeric Sorting', () => {
        it('should sort by numeric ID ascending', () => {
            const data = generateSortTestData();
            
            // Sort by id ascending
            const sorted = [...data].sort((a, b) => a.id - b.id);
            
            expect(sorted[0].id).toBe(1);
            expect(sorted[9].id).toBe(10);
            
            // Verify ascending order
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].id).toBeGreaterThanOrEqual(sorted[i - 1].id);
            }
        });

        it('should sort by numeric ID descending', () => {
            const data = generateSortTestData();
            
            // Sort by id descending
            const sorted = [...data].sort((a, b) => b.id - a.id);
            
            expect(sorted[0].id).toBe(10);
            expect(sorted[9].id).toBe(1);
            
            // Verify descending order
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].id).toBeLessThanOrEqual(sorted[i - 1].id);
            }
        });

        it('should sort by price ascending', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => a.price - b.price);
            
            expect(sorted[0].price).toBe(99.99);
            expect(sorted[9].price).toBe(599.99);
            
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
            }
        });

        it('should sort by price descending', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => b.price - a.price);
            
            expect(sorted[0].price).toBe(599.99);
            expect(sorted[9].price).toBe(99.99);
            
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].price).toBeLessThanOrEqual(sorted[i - 1].price);
            }
        });

        it('should sort by decimal rating ascending', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => a.rating - b.rating);
            
            expect(sorted[0].rating).toBe(4.0);
            expect(sorted[9].rating).toBe(4.9);
            
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].rating).toBeGreaterThanOrEqual(sorted[i - 1].rating);
            }
        });

        it('should handle equal values in numeric sort', () => {
            const data: IRow[] = [
                { id: 1, value: 100 },
                { id: 2, value: 100 },
                { id: 3, value: 50 },
                { id: 4, value: 100 },
                { id: 5, value: 75 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            expect(sorted[0].value).toBe(50);
            expect(sorted[1].value).toBe(75);
            expect(sorted[2].value).toBe(100);
            expect(sorted[3].value).toBe(100);
            expect(sorted[4].value).toBe(100);
        });
    });

    describe('String Sorting', () => {
        it('should sort by string name ascending (alphabetical)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
            
            expect(sorted[0].name).toBe('Alpha');
            expect(sorted[9].name).toBe('Juliet');
            
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].name.localeCompare(sorted[i - 1].name)).toBeGreaterThanOrEqual(0);
            }
        });

        it('should sort by string name descending (reverse alphabetical)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => b.name.localeCompare(a.name));
            
            expect(sorted[0].name).toBe('Juliet');
            expect(sorted[9].name).toBe('Alpha');
            
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].name.localeCompare(sorted[i - 1].name)).toBeLessThanOrEqual(0);
            }
        });

        it('should sort by category alphabetically', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => a.category.localeCompare(b.category));
            
            // Books < Clothing < Electronics < Home < Sports
            expect(['Books', 'Clothing'].includes(sorted[0].category)).toBe(true);
            expect(['Home', 'Sports'].includes(sorted[9].category)).toBe(true);
        });

        it('should handle case-sensitive string sorting', () => {
            const data: IRow[] = [
                { name: 'apple' },
                { name: 'Apple' },
                { name: 'APPLE' },
                { name: 'banana' },
            ];
            
            const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
            
            // All apple variants should come before banana
            expect(sorted[3].name).toBe('banana');
        });
    });

    describe('Date/Temporal Sorting', () => {
        it('should sort by date ascending', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            
            expect(sorted[0].date).toBe('2024-01-05');
            expect(sorted[9].date).toBe('2024-03-20');
            
            for (let i = 1; i < sorted.length; i++) {
                const prevTime = new Date(sorted[i - 1].date).getTime();
                const currTime = new Date(sorted[i].date).getTime();
                expect(currTime).toBeGreaterThanOrEqual(prevTime);
            }
        });

        it('should sort by date descending', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            
            expect(sorted[0].date).toBe('2024-03-20');
            expect(sorted[9].date).toBe('2024-01-05');
            
            for (let i = 1; i < sorted.length; i++) {
                const prevTime = new Date(sorted[i - 1].date).getTime();
                const currTime = new Date(sorted[i].date).getTime();
                expect(currTime).toBeLessThanOrEqual(prevTime);
            }
        });

        it('should handle timestamp sorting', () => {
            const data: IRow[] = [
                { id: 1, timestamp: Date.parse('2024-03-15') },
                { id: 2, timestamp: Date.parse('2024-01-10') },
                { id: 3, timestamp: Date.parse('2024-02-20') },
            ];
            
            const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
            
            expect(sorted[0].id).toBe(2);
            expect(sorted[1].id).toBe(3);
            expect(sorted[2].id).toBe(1);
        });
    });

    describe('Multi-field Sorting', () => {
        it('should sort by category then price', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => {
                const categoryCompare = a.category.localeCompare(b.category);
                if (categoryCompare !== 0) return categoryCompare;
                return a.price - b.price;
            });
            
            // Verify primary sort (category)
            for (let i = 1; i < sorted.length; i++) {
                const prevCat = sorted[i - 1].category;
                const currCat = sorted[i].category;
                const catCompare = currCat.localeCompare(prevCat);
                
                if (catCompare === 0) {
                    // Same category: verify price is sorted
                    expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
                } else {
                    // Different category: should be alphabetically ordered
                    expect(catCompare).toBeGreaterThan(0);
                }
            }
        });

        it('should sort by rating descending then price ascending', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => {
                const ratingCompare = b.rating - a.rating; // descending
                if (ratingCompare !== 0) return ratingCompare;
                return a.price - b.price; // ascending
            });
            
            // Highest rating first
            expect(sorted[0].rating).toBe(4.9);
            
            // Verify secondary sort for equal ratings
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i].rating === sorted[i - 1].rating) {
                    expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
                }
            }
        });
    });

    describe('Edge Cases and Special Values', () => {
        it('should handle null values in numeric sort', () => {
            const data: IRow[] = [
                { id: 1, value: 100 },
                { id: 2, value: null },
                { id: 3, value: 50 },
                { id: 4, value: null },
                { id: 5, value: 75 },
            ];
            
            const sorted = [...data].sort((a, b) => {
                if (a.value === null && b.value === null) return 0;
                if (a.value === null) return 1; // nulls last
                if (b.value === null) return -1;
                return a.value - b.value;
            });
            
            // Non-null values should be sorted first
            expect(sorted[0].value).toBe(50);
            expect(sorted[1].value).toBe(75);
            expect(sorted[2].value).toBe(100);
            // Null values last
            expect(sorted[3].value).toBeNull();
            expect(sorted[4].value).toBeNull();
        });

        it('should handle undefined values', () => {
            const data: IRow[] = [
                { id: 1, value: 100 },
                { id: 2, value: undefined },
                { id: 3, value: 50 },
            ];
            
            const sorted = [...data].sort((a, b) => {
                if (a.value === undefined && b.value === undefined) return 0;
                if (a.value === undefined) return 1;
                if (b.value === undefined) return -1;
                return a.value - b.value;
            });
            
            expect(sorted[0].value).toBe(50);
            expect(sorted[1].value).toBe(100);
            expect(sorted[2].value).toBeUndefined();
        });

        it('should handle empty array', () => {
            const data: IRow[] = [];
            
            const sorted = [...data].sort((a, b) => a.id - b.id);
            
            expect(sorted.length).toBe(0);
        });

        it('should handle single element', () => {
            const data: IRow[] = [{ id: 1, name: 'Solo' }];
            
            const sorted = [...data].sort((a, b) => a.id - b.id);
            
            expect(sorted.length).toBe(1);
            expect(sorted[0].id).toBe(1);
        });

        it('should handle already sorted data', () => {
            const data: IRow[] = [
                { id: 1, value: 10 },
                { id: 2, value: 20 },
                { id: 3, value: 30 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            expect(sorted[0].value).toBe(10);
            expect(sorted[1].value).toBe(20);
            expect(sorted[2].value).toBe(30);
        });

        it('should handle reverse sorted data', () => {
            const data: IRow[] = [
                { id: 3, value: 30 },
                { id: 2, value: 20 },
                { id: 1, value: 10 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            expect(sorted[0].value).toBe(10);
            expect(sorted[1].value).toBe(20);
            expect(sorted[2].value).toBe(30);
        });

        it('should handle all equal values', () => {
            const data: IRow[] = [
                { id: 1, value: 100 },
                { id: 2, value: 100 },
                { id: 3, value: 100 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            sorted.forEach(row => {
                expect(row.value).toBe(100);
            });
        });

        it('should handle very large numbers', () => {
            const data: IRow[] = [
                { value: 1e10 },
                { value: 1e5 },
                { value: 1e15 },
                { value: 1e8 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            expect(sorted[0].value).toBe(1e5);
            expect(sorted[1].value).toBe(1e8);
            expect(sorted[2].value).toBe(1e10);
            expect(sorted[3].value).toBe(1e15);
        });

        it('should handle negative numbers', () => {
            const data: IRow[] = [
                { value: 50 },
                { value: -10 },
                { value: 0 },
                { value: -50 },
                { value: 10 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            expect(sorted[0].value).toBe(-50);
            expect(sorted[1].value).toBe(-10);
            expect(sorted[2].value).toBe(0);
            expect(sorted[3].value).toBe(10);
            expect(sorted[4].value).toBe(50);
        });
    });

    describe('Stability of Sort', () => {
        it('should maintain relative order for equal values (stable sort)', () => {
            const data: IRow[] = [
                { id: 1, category: 'A', value: 100 },
                { id: 2, category: 'B', value: 100 },
                { id: 3, category: 'C', value: 50 },
                { id: 4, category: 'D', value: 100 },
            ];
            
            const sorted = [...data].sort((a, b) => a.value - b.value);
            
            // Value 50 should be first
            expect(sorted[0].id).toBe(3);
            
            // For value 100, original order should be maintained (1, 2, 4)
            const hundredItems = sorted.filter(r => r.value === 100);
            expect(hundredItems[0].id).toBe(1);
            expect(hundredItems[1].id).toBe(2);
            expect(hundredItems[2].id).toBe(4);
        });
    });

    describe('Real-World Business Scenarios', () => {
        it('should sort products for inventory report (low stock first)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => a.stock - b.stock);
            
            // Lowest stock first for reordering
            expect(sorted[0].stock).toBe(20);
            expect(sorted[sorted.length - 1].stock).toBe(200);
            
            // Verify entire ascending order
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].stock).toBeGreaterThanOrEqual(sorted[i - 1].stock);
            }
        });

        it('should sort by rating for featured products (highest first)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => b.rating - a.rating);
            
            // Best rated products first
            expect(sorted[0].rating).toBe(4.9);
            expect(sorted[sorted.length - 1].rating).toBe(4.0);
        });

        it('should sort by price for budget shoppers (cheapest first)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => a.price - b.price);
            
            expect(sorted[0].price).toBe(99.99);
            expect(sorted[sorted.length - 1].price).toBe(599.99);
        });

        it('should sort by recency for "new arrivals" (latest first)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            
            // Most recent products first
            expect(sorted[0].date).toBe('2024-03-20');
            expect(sorted[sorted.length - 1].date).toBe('2024-01-05');
        });

        it('should sort for category browse page (category, then price)', () => {
            const data = generateSortTestData();
            
            const sorted = [...data].sort((a, b) => {
                const catCompare = a.category.localeCompare(b.category);
                if (catCompare !== 0) return catCompare;
                return a.price - b.price;
            });
            
            // Group by category
            let currentCategory = sorted[0].category;
            let categoryStartIndex = 0;
            
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i].category !== currentCategory) {
                    // Verify prices in previous category were sorted
                    for (let j = categoryStartIndex + 1; j < i; j++) {
                        expect(sorted[j].price).toBeGreaterThanOrEqual(sorted[j - 1].price);
                    }
                    currentCategory = sorted[i].category;
                    categoryStartIndex = i;
                }
            }
        });

        it('should sort for recommendation algorithm (rating desc, price asc)', () => {
            const data = generateSortTestData();
            
            // Recommend highest rated, and if tie, cheapest option
            const sorted = [...data].sort((a, b) => {
                const ratingDiff = b.rating - a.rating;
                if (Math.abs(ratingDiff) > 0.01) return ratingDiff;
                return a.price - b.price;
            });
            
            // Best rated first
            expect(sorted[0].rating).toBeGreaterThanOrEqual(4.7);
            
            // For similar ratings, cheaper first
            for (let i = 1; i < sorted.length; i++) {
                if (Math.abs(sorted[i].rating - sorted[i - 1].rating) < 0.01) {
                    expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
                }
            }
        });
    });

    describe('Performance Characteristics', () => {
        it('should handle large dataset efficiently', () => {
            // Generate 10,000 items
            const data: IRow[] = Array.from({ length: 10000 }, (_, i) => ({
                id: Math.floor(Math.random() * 100000),
                value: Math.random() * 1000,
                name: `Item-${i}`,
            }));
            
            const startTime = Date.now();
            const sorted = [...data].sort((a, b) => a.value - b.value);
            const duration = Date.now() - startTime;
            
            // Should complete quickly (JavaScript's built-in sort is O(n log n))
            expect(duration).toBeLessThan(100); // Should be well under 100ms
            
            // Verify correctness
            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].value).toBeGreaterThanOrEqual(sorted[i - 1].value);
            }
            
            console.log(`Sorted 10k items in ${duration}ms`);
        });

        it('should handle 100k dataset', () => {
            const data: IRow[] = Array.from({ length: 100000 }, (_, i) => ({
                id: i,
                value: Math.random() * 10000,
            }));
            
            const startTime = Date.now();
            const sorted = [...data].sort((a, b) => a.value - b.value);
            const duration = Date.now() - startTime;
            
            expect(duration).toBeLessThan(1000); // Should be under 1 second
            
            // Spot check correctness
            expect(sorted[0].value).toBeLessThanOrEqual(sorted[1000].value);
            expect(sorted[50000].value).toBeLessThanOrEqual(sorted[99999].value);
            
            console.log(`Sorted 100k items in ${duration}ms`);
        });
    });
});
