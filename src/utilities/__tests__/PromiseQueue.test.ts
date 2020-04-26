import PromiseQueue from './../PromiseQueue';
describe('PromiseQueue', () => {
    let queue: PromiseQueue;

    beforeEach(() => {
        queue = new PromiseQueue();
    });

    const createDummyResolvingPromise = (
        length: number,
        result: string
    ): Promise<string> =>
        new Promise((resolve) => {
            setTimeout(() => resolve(result), length);
        });

    const createDummyRejectingPromise = (
        length: number,
        error: Error
    ): Promise<void> =>
        new Promise((_resolve, reject) => {
            setTimeout(() => reject(error), length);
        });

    describe('when items are added', () => {
        it('should start', () => {
            queue.add<string>(() =>
                createDummyResolvingPromise(300, 'some value')
            );

            expect(queue.started).toBe(true);
        });

        it('should resolve with the result value of the added promise', (done) => {
            const result = 'Some result';

            queue
                .add<string>(() => createDummyResolvingPromise(300, result))
                .then((output) => {
                    expect(output).toBe(result);

                    done();
                });
        });

        it('should reject with the error that the added promise rejected with', (done) => {
            const error = new Error('Some error');

            queue
                .add<void>(() => createDummyRejectingPromise(300, error))
                .catch((incomingError) => {
                    expect(incomingError).toBe(error);

                    done();
                });
        });

        it('should execute the supplied execute callbacks one by one', (done) => {
            let noResolved = 0;

            const checkCanResolve = () => {
                if (noResolved === 3) {
                    done();
                }
            };

            const firstResult = 'first result';
            queue
                .add<string>(() =>
                    createDummyResolvingPromise(500, firstResult)
                )
                .then((output) => {
                    expect(output).toBe(firstResult);
                    expect(queue.length).toBe(2);

                    noResolved++;
                    checkCanResolve();
                });

            const secondResult = 'second results';
            queue
                .add<string>(() =>
                    createDummyResolvingPromise(500, secondResult)
                )
                .then((output) => {
                    expect(output).toBe(secondResult);
                    expect(queue.length).toBe(1);

                    noResolved++;
                    checkCanResolve();
                });

            const thirdResult = 'second results';
            queue
                .add<string>(() =>
                    createDummyResolvingPromise(500, thirdResult)
                )
                .then((output) => {
                    expect(output).toBe(thirdResult);
                    expect(queue.length).toBe(0);

                    noResolved++;
                    checkCanResolve();
                });
        });
    });
});
