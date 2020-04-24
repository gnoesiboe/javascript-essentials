import { NamespacedLogger, createNamespacedLogger } from './../logger';
describe('logger', () => {
    describe('createNamespacedLogger', () => {
        let namespacedLogger: NamespacedLogger;
        const namespace = 'security';

        beforeEach(() => {
            namespacedLogger = createNamespacedLogger(namespace);

            // mock console to be able to test using it
            Object.defineProperty(window, 'console', {
                value: {
                    debug: jest.fn(),
                    info: jest.fn(),
                    warn: jest.fn(),
                    error: jest.fn(),
                },
                writable: true,
            });
        });

        describe('When supplied with no arguments', () => {
            it('should log only the namespace', () => {
                namespacedLogger.debug();

                expect(console.debug).toBeCalledTimes(1);
                expect(console.debug).toBeCalledWith(
                    `[${namespace.toUpperCase()}]`
                );
            });
        });

        describe('When supplied with multiple arguments', () => {
            it('should prefix that log with the namespace', () => {
                namespacedLogger.info('eerste', 3);

                const expectedOutput = `[${namespace.toUpperCase()}]`;

                expect(console.info).toBeCalledTimes(1);
                expect(console.info).toBeCalledWith(
                    `[${namespace.toUpperCase()}]`,
                    'eerste',
                    3
                );
            });
        });
    });
});
