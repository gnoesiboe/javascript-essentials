export type Logger = (...itemsToLog: any[]) => void;

type Level = 'info' | 'debug' | 'warn' | 'error';

export type NamespacedLogger = Record<Level, Logger>;

export function createNamespacedLogger(namespace: string): NamespacedLogger {
    const formattedSection: string = `[${namespace.toUpperCase()}]`;

    const log = (level: Level, ...itemsToLog: any[]) => {
        const combinedItemsToLog: any[] = [formattedSection, ...itemsToLog];

        // console.log.apply with null as object context, does not seem to work in IE
        try {
            console[level].call(null, ...combinedItemsToLog);
        } catch (error) {
            console[level](combinedItemsToLog);
        }
    };

    const debug: Logger = (...itemsToLog) => log('debug', ...itemsToLog);
    const info: Logger = (...itemsToLog) => log('info', ...itemsToLog);
    const warn: Logger = (...itemsToLog) => log('warn', ...itemsToLog);
    const error: Logger = (...itemsToLog) => log('warn', ...itemsToLog);

    return { debug, info, warn, error };
}
