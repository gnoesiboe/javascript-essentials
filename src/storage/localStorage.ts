import { Serializable } from '../types/utility';

export type OnErrorHandler = (error: Error) => void;

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

export function getBoolean(
    key: string,
    fallback: boolean = false,
    catchError: boolean = true,
    onError?: OnErrorHandler
): boolean {
    const value = get(key, catchError, onError);

    switch (value) {
        case 'true':
            return true;

        case 'false':
            return false;

        default:
            return fallback;
    }
}

export function getInt(
    key: string,
    fallback: number,
    catchError: boolean = true,
    onError?: OnErrorHandler
): number {
    const value = get(key, catchError, onError);

    return value !== null ? parseInt(value) : fallback;
}

export function get(
    key: string,
    catchError: boolean = true,
    onError?: OnErrorHandler
): string | null {
    if (!catchError && onError) {
        throw new Error(
            'Assigning an onError callback when errors are not caught does not make sense'
        );
    }

    const execute = () => localStorage.getItem(key);

    return catchError
        ? executeWithErrorCatcher<string | null>(execute, null, onError)
        : execute();
}

export function write(
    key: string,
    value: Serializable,
    catchError: boolean = true,
    onError?: OnErrorHandler
): boolean {
    if (!catchError && onError) {
        throw new Error(
            'Assigning an onError callback when errors are not caught does not make sense'
        );
    }

    const execute = () => {
        const valueAsString: string =
            typeof value === 'string' ? value : JSON.stringify(value);

        localStorage.setItem(key, valueAsString);

        return true;
    };

    return catchError
        ? executeWithErrorCatcher<boolean>(execute, false, onError)
        : execute();
}
