import { mergeJson } from '../merge-json';
describe('mergeJson', () => {
    describe('plain merge', () => {
        it('should merge simple objects', () => {
            const a = { x: 1, y: 2 };
            const b = { z: 3 };
            expect(mergeJson(a, b)).toEqual({ x: 1, y: 2, z: 3 });
        });
        it('should override scalar values in a with values from b', () => {
            const a = { x: 1, y: 2 };
            const b = { x: 10 };
            expect(mergeJson(a, b)).toEqual({ x: 10, y: 2 });
        });
        it('should handle empty objects', () => {
            expect(mergeJson({}, {})).toEqual({});
            expect(mergeJson({ a: 1 }, {})).toEqual({ a: 1 });
            expect(mergeJson({}, { b: 2 })).toEqual({ b: 2 });
        });
    });
    describe('nested object merge', () => {
        it('should deeply merge nested objects', () => {
            const a = { config: { debug: true, port: 3000 } };
            const b = { config: { timeout: 5000 } };
            expect(mergeJson(a, b)).toEqual({
                config: { debug: true, port: 3000, timeout: 5000 },
            });
        });
        it('should override scalar values in nested objects', () => {
            const a = { config: { debug: true, port: 3000 } };
            const b = { config: { debug: false } };
            expect(mergeJson(a, b)).toEqual({
                config: { debug: false, port: 3000 },
            });
        });
        it('should handle multiple levels of nesting', () => {
            const a = {
                app: { server: { port: 3000, host: 'localhost' }, name: 'app1' },
            };
            const b = {
                app: { server: { timeout: 5000 }, version: '1.0.0' },
            };
            expect(mergeJson(a, b)).toEqual({
                app: {
                    server: { port: 3000, host: 'localhost', timeout: 5000 },
                    name: 'app1',
                    version: '1.0.0',
                },
            });
        });
    });
    describe('array deduplication', () => {
        it('should concatenate and deduplicate arrays', () => {
            const a = { items: [1, 2, 3] };
            const b = { items: [3, 4, 5] };
            const result = mergeJson(a, b);
            expect(result.items).toHaveLength(5);
            expect(result.items).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
        });
        it('should handle arrays with strings', () => {
            const a = { tags: ['a', 'b', 'c'] };
            const b = { tags: ['c', 'd'] };
            const result = mergeJson(a, b);
            expect(result.tags).toHaveLength(4);
            expect(result.tags).toEqual(expect.arrayContaining(['a', 'b', 'c', 'd']));
        });
        it('should handle empty arrays', () => {
            const a = { items: [] };
            const b = { items: [1, 2] };
            expect(mergeJson(a, b)).toEqual({ items: [1, 2] });
            const a2 = { items: [1, 2] };
            const b2 = { items: [] };
            const result = mergeJson(a2, b2);
            expect(result.items).toHaveLength(2);
            expect(result.items).toEqual(expect.arrayContaining([1, 2]));
        });
        it('should deduplicate arrays with duplicate elements', () => {
            const a = { items: [1, 1, 2] };
            const b = { items: [2, 3, 3] };
            const result = mergeJson(a, b);
            expect(result.items).toHaveLength(3);
            expect(result.items).toEqual(expect.arrayContaining([1, 2, 3]));
        });
    });
    describe('mixed scenarios', () => {
        it('should handle arrays and nested objects together', () => {
            const a = {
                config: { tags: ['a', 'b'], settings: { debug: true } },
            };
            const b = {
                config: { tags: ['b', 'c'], settings: { verbose: true } },
            };
            const result = mergeJson(a, b);
            const config = result.config;
            const settings = config.settings;
            const tags = config.tags;
            expect(settings).toEqual({ debug: true, verbose: true });
            expect(tags).toHaveLength(3);
            expect(tags).toEqual(expect.arrayContaining(['a', 'b', 'c']));
        });
        it('should replace arrays when not both are arrays', () => {
            const a = { data: [1, 2, 3] };
            const b = { data: 'string value' };
            expect(mergeJson(a, b)).toEqual({ data: 'string value' });
        });
        it('should replace objects when b value is scalar', () => {
            const a = { config: { x: 1, y: 2 } };
            const b = { config: 'production' };
            expect(mergeJson(a, b)).toEqual({ config: 'production' });
        });
        it('should preserve original objects (no mutation)', () => {
            const a = { x: 1, nested: { y: 2 } };
            const b = { nested: { z: 3 } };
            const originalA = JSON.stringify(a);
            mergeJson(a, b);
            expect(JSON.stringify(a)).toEqual(originalA);
        });
    });
    describe('edge cases', () => {
        it('should handle null and undefined values', () => {
            const a = { x: null };
            const b = { x: 'value' };
            expect(mergeJson(a, b)).toEqual({ x: 'value' });
        });
        it('should handle boolean values', () => {
            const a = { debug: true };
            const b = { debug: false };
            expect(mergeJson(a, b)).toEqual({ debug: false });
        });
        it('should handle numeric values', () => {
            const a = { count: 10, ratio: 0.5 };
            const b = { count: 20 };
            expect(mergeJson(a, b)).toEqual({ count: 20, ratio: 0.5 });
        });
        it('should handle objects with multiple array properties', () => {
            const a = { deps: ['a', 'b'], devDeps: ['c', 'd'] };
            const b = { deps: ['b', 'e'], devDeps: ['d', 'f'] };
            const result = mergeJson(a, b);
            expect(result.deps).toHaveLength(3);
            expect(result.deps).toEqual(expect.arrayContaining(['a', 'b', 'e']));
            expect(result.devDeps).toHaveLength(3);
            expect(result.devDeps).toEqual(expect.arrayContaining(['c', 'd', 'f']));
        });
    });
});
