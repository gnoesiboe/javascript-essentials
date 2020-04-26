type CacheEntryType = {
    value: any;
    timeoutHandle: number | null;
};
type CacheRegistryType = {
    [namespace: string]: {
        [key: string]: CacheEntryType;
    };
};
type CacheCreator<T> = () => Promise<T>;
type GetOrCreateType<T> = (key: string, create: CacheCreator<T>) => Promise<T>;
type Get<T> = (key: string) => T | void;
type RemoveType = (key: string) => void;
type ClearAllType = () => void;
type SetType<T> = (key: string, value: T) => void;
type CountType = () => number;
export type CacheType<T> = {
    getOrCreate: GetOrCreateType<T>;
    get: Get<T>;
    remove: RemoveType;
    clear: ClearAllType;
    set: SetType<T>;
    count: CountType;
};

const cache: CacheRegistryType = {};

function clearEntryTimeoutHandleIfRequired(entry: CacheEntryType) {
    if (!entry.timeoutHandle) {
        return;
    }

    clearTimeout(entry.timeoutHandle);
}

function validateCacheNamespaceIsSet(namespace: string) {
    if (typeof cache[namespace] === 'undefined') {
        throw new Error(
            `Expecting cache namespace '${namespace}' to be available`
        );
    }
}

export const createInMemoryCache = <T>(
    namespace: string,
    maxAgeInSeconds?: number
): CacheType<T> => {
    cache[namespace] = {};

    const remove: RemoveType = (key) => {
        validateCacheNamespaceIsSet(namespace);

        const entry = cache[namespace][key];

        if (!entry) {
            return;
        }

        clearEntryTimeoutHandleIfRequired(entry);

        delete cache[namespace][key];
    };

    const clear: ClearAllType = () => {
        validateCacheNamespaceIsSet(namespace);

        // make sure we clear all timeouts to prevent memory leaks
        Object.keys(cache[namespace]).forEach((key) =>
            clearEntryTimeoutHandleIfRequired(cache[namespace][key])
        );

        cache[namespace] = {};
    };

    const set: SetType<T> = (key: string, value: T) => {
        const entry: CacheEntryType = {
            value,
            timeoutHandle: null,
        };

        if (maxAgeInSeconds) {
            // eslint-disable-next-line no-magic-numbers
            const maxAgeInMilliSeconds = maxAgeInSeconds * 1000;

            entry.timeoutHandle = setTimeout(
                () => remove(key),
                maxAgeInMilliSeconds
            );
        }

        cache[namespace][key] = entry;
    };

    const getOrCreate: GetOrCreateType<T> = async (key, create) => {
        validateCacheNamespaceIsSet(namespace);

        if (cache[namespace][key]) {
            const value = cache[namespace][key].value;

            return value as T;
        }

        const value = await create();

        set(key, value);

        return value;
    };

    const get: Get<T> = (key) => {
        validateCacheNamespaceIsSet(namespace);

        if (cache[namespace][key]) {
            const value = cache[namespace][key].value;

            return value as T;
        }

        return undefined;
    };

    const count: CountType = () => {
        validateCacheNamespaceIsSet(namespace);

        return Object.keys(cache[namespace]).length;
    };

    return { get, getOrCreate, remove, clear, set, count };
};
