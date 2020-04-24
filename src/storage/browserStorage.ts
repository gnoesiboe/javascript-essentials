import { Serializable } from '../types/utility';

export type OnErrorHandler = (error: Error) => void;

type GetBoolean = (
    key: string,
    fallback: boolean,
    catchError?: boolean,
    onError?: OnErrorHandler
) => boolean;

type GetInt = (
    key: string,
    fallback?: number,
    catchError?: boolean,
    onError?: OnErrorHandler
) => number;

type Get = (
    key: string,
    catchError?: boolean,
    onError?: OnErrorHandler
) => string | null;

type Write = (
    key: string,
    value: Serializable,
    catchError?: boolean,
    onError?: OnErrorHandler
) => boolean;

type BrowserStorage = {
    getBoolean: GetBoolean;
    getInt: GetInt;
    get: Get;
    write: Write;
};

const executeWithErrorCatcher = <ReturnType>(
    execute: () => ReturnType,
    fallback: ReturnType,
    onError?: OnErrorHandler
): ReturnType => {
    try {
        return execute();
    } catch (error) {
        if (onError) {
            onError(error);
        }

        return fallback;
    }
};

export function createBrowserStorage(driver: Storage): BrowserStorage {
    const get: Get = (
        key: string,
        catchError: boolean = true,
        onError?: OnErrorHandler
    ): string | null => {
        if (!catchError && onError) {
            throw new Error(
                'Assigning an onError callback when errors are not caught does not make sense'
            );
        }

        const execute = () => driver.getItem(key);

        return catchError
            ? executeWithErrorCatcher<string | null>(execute, null, onError)
            : execute();
    };

    const getInt: GetInt = (
        key: string,
        fallback: number = -1,
        catchError: boolean = true,
        onError?: OnErrorHandler
    ): number => {
        const value = get(key, catchError, onError);

        return value !== null ? parseInt(value) : fallback;
    };

    const getBoolean: GetBoolean = (
        key: string,
        fallback: boolean = false,
        catchError: boolean = true,
        onError?: OnErrorHandler
    ): boolean => {
        const value = get(key, catchError, onError);

        switch (value) {
            case 'true':
                return true;

            case 'false':
                return false;

            default:
                return fallback;
        }
    };

    const write: Write = (
        key: string,
        value: Serializable,
        catchError: boolean = true,
        onError?: OnErrorHandler
    ): boolean => {
        if (!catchError && onError) {
            throw new Error(
                'Assigning an onError callback when errors are not caught does not make sense'
            );
        }

        const execute = () => {
            const valueAsString: string =
                typeof value === 'string' ? value : JSON.stringify(value);

            driver.setItem(key, valueAsString);

            return true;
        };

        return catchError
            ? executeWithErrorCatcher<boolean>(execute, false, onError)
            : execute();
    };

    return { getInt, getBoolean, get, write };
}
