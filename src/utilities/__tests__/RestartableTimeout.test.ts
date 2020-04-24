import RestartableTimeout, { CallbackFunction } from '../RestartableTimeout';

describe('RestartableTimeout', () => {
    let timeoutLength = 500; // half a second
    let timeout: RestartableTimeout;

    beforeEach(() => {
        timeout = new RestartableTimeout(timeoutLength);
    });

    describe('when not started', () => {
        it('should not call the callback', (done) => {
            const callback: CallbackFunction = jest.fn();

            timeout.addCallback(callback);

            setTimeout(() => {
                expect(callback).not.toBeCalled();

                done();
            }, timeoutLength * 2);
        });
    });

    describe('when started', () => {
        describe('and started again', () => {
            it('should throw an error', () => {
                timeout.start();

                const startAgain = () => timeout.start();

                expect(startAgain).toThrow();
            });
        });

        it('should call the callback after the timeout is finished', (done) => {
            timeout.addCallback(() => {
                done();
            });

            timeout.start();
        });

        it('should allow for callback chaining', (done) => {
            const firstCallback: CallbackFunction = () => done();

            const secondCallback: CallbackFunction = (next: Function) => {
                expect(typeof next).toBe('function');

                next();
            };

            timeout.addCallback(firstCallback);
            timeout.addCallback(secondCallback);

            timeout.start();
        });

        it('should allow you to break the callback chain', (done) => {
            const firstCallback: CallbackFunction = () => {
                throw new Error('Should never occur');
            };

            const secondCallback: CallbackFunction = (next: Function) => {
                expect(typeof next).toBe('function');

                done();
            };

            timeout.addCallback(firstCallback);
            timeout.addCallback(secondCallback);

            timeout.start();
        });

        it('should allow you to stop and reset it at any time', () => {
            const callback: CallbackFunction = jest.fn();

            timeout.addCallback(callback);
            timeout.start();

            timeout.stopAndReset();

            expect(callback).not.toBeCalled();
        });

        it('should allow you to restart it', (done) => {
            const callback: CallbackFunction = () => {
                done();
            };

            timeout.addCallback(callback);
            timeout.start();
            timeout.restart();
        });
    });
});
