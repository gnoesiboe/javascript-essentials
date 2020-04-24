import { write, get } from '../localStorage';
import { OnErrorHandler } from '../browserStorage';

describe('localStorage', () => {
    describe('write', () => {
        describe('when an error occurs', () => {
            beforeEach(() => {
                // @ts-ignore => typescript does not know localStorage.getItem is mocked
                window.localStorage.setItem.mockImplementation(() => {
                    throw new Error();
                });
            });

            describe("and it's not told to catch it", () => {
                it('should throw the error', () => {
                    const execute = () => {
                        write('test', 'value', false);
                    };

                    expect(execute).toThrow();
                });
            });

            describe("and it's told to catch it", () => {
                it('should catch the error and return false', () => {
                    const success = write('test', 'value', true);

                    expect(success).toBe(false);
                });

                describe('and an onError handler is provided', () => {
                    it('should call the on error handler', (done) => {
                        const onError: OnErrorHandler = (error) => {
                            expect(typeof error).toBe('object');

                            done();
                        };

                        write('test', 'value', true, onError);
                    });
                });
            });
        });

        describe('when no error occurs', () => {
            it('should save the value in storage', () => {
                const key = 'test';
                const value = 'value';

                write(key, value);

                expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
                expect(window.localStorage.setItem).toHaveBeenCalledWith(
                    key,
                    value
                );
            });
        });
    });

    describe('get', () => {
        describe('when an error occurs', () => {
            beforeEach(() => {
                // @ts-ignore => typescript does not know localStorage.getItem is mocked
                window.localStorage.getItem.mockImplementation(() => {
                    throw new Error();
                });
            });

            describe("and it's not told to catch it", () => {
                it('should throw the error', () => {
                    const execute = () => {
                        get('value', false);
                    };

                    expect(execute).toThrow();
                });
            });

            describe("and it's told to catch it", () => {
                it('should catch the error and return null', () => {
                    const key = 'key';
                    write(key, 'someValue');

                    const value = get(key);

                    expect(value).toBeNull();
                });

                describe('and an onError handler is provided', () => {
                    it('should call the on error handler', (done) => {
                        const onError: OnErrorHandler = (error) => {
                            expect(typeof error).toBe('object');

                            done();
                        };

                        const key = 'key';
                        write(key, 'someValue');

                        get(key, true, onError);
                    });
                });
            });
        });
    });
});
