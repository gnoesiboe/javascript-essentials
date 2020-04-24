import { createInMemoryCache, CacheType } from './../inMemoryCacheFactory';
describe('inMemoryCacheFactory', () => {
    describe('createInMemoryCache', () => {
        let cache: CacheType<string>;

        beforeEach(() => {
            cache = createInMemoryCache<string>('myCache');
        });

        it('should allow us to get an item from the cache that we put in it earlier', () => {
            const key = 'someKey';
            const value = 'some value';

            cache.set(key, value);

            expect(cache.get(key)).toEqual(value);
        });

        it('should allow us to recreate a value asyncronically', async () => {
            const key = 'someKey';
            const someNewValue = 'some new value';

            const result = await cache.getOrCreate(key, async () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(someNewValue);
                    }, 20);
                });
            });

            expect(result).toBe(someNewValue);
        });

        it('should allow us to remove an item', () => {
            const key = 'someKey';
            const value = 'some value';

            cache.set(key, value);

            expect(value).toBe(value);

            cache.remove(key);

            expect(cache.get(key)).toBeUndefined();
        });

        it('should allow us to clear the entire cache', () => {
            cache.set('first', 'some value');
            cache.set('second', 'some other value');

            expect(cache.count()).toBe(2);

            cache.clear();

            expect(cache.count()).toBe(0);

            expect(cache.get('first')).toBeUndefined();
            expect(cache.get('second')).toBeUndefined();
        });

        it('should allow us to create multiple, seperate caches', () => {
            const key = 'someKey';
            const firstValue = 'first value';
            const secondValue = 'second value';

            const otherCache = createInMemoryCache('otherNamespace');

            cache.set(key, firstValue);
            otherCache.set(key, secondValue);

            expect(cache.get(key)).toBe(firstValue);
            expect(otherCache.get(key)).toBe(secondValue);
        });

        it('should expire items in the cache based upon its expires settings', (done) => {
            const otherCache = createInMemoryCache('otherNamespace', 1);

            const key = 'someKey';
            const value = 'some value';

            otherCache.set(key, value);

            expect(otherCache.get(key)).toBe(value);

            setTimeout(() => {
                expect(otherCache.get(key)).toBeUndefined();

                done();
            }, 1500); //
        });

        it('should not modify the value in any way', () => {
            const key = 'someKey';
            const incomingValue = { first: { test: 'other' }, second: false };

            const objectCache = createInMemoryCache<Record<string, any>>(
                'otherNamespace'
            );

            objectCache.set(key, incomingValue);

            const retrievedValue = objectCache.get(key);

            expect(retrievedValue).toStrictEqual(incomingValue);
            expect(retrievedValue).toBe(incomingValue);
        });
    });
});
