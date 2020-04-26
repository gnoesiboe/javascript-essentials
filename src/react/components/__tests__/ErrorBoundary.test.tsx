import React, { ErrorInfo } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorBoundary, { OnErrorOccurredHandler } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
    let ComponentThatThrowsError: React.FC;
    let ErrorInformation: React.FC<{ error: Error; errorInfo: ErrorInfo }>;

    beforeAll(() => {
        // disable error log to be able to test the error bounday without extra error console logs
        // @ts-ignore => typescript does not know about existance
        disableErrorLog();
    });

    afterAll(() => {
        // @ts-ignore => typescript does not know about existance
        enableErrorLog();
    });

    beforeEach(() => {
        ComponentThatThrowsError = () => {
            throw new Error('test');
        };

        ErrorInformation = ({ error, errorInfo }) => (
            <div>
                <h1>Something went wrong</h1>
                <pre>{error.message}</pre>
                <pre>{errorInfo.componentStack}</pre>
            </div>
        );
    });

    describe('when an error is thrown and not caught in a child component', () => {
        it('should catch it and render the fallback', async () => {
            const { asFragment } = render(
                <ErrorBoundary
                    renderFallback={(error, errorInfo) => (
                        <ErrorInformation error={error} errorInfo={errorInfo} />
                    )}
                >
                    <ComponentThatThrowsError />
                </ErrorBoundary>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        describe('when an onError callback is supplied', () => {
            it('should call it with the error and error information', (done) => {
                const onErrorOccurred: OnErrorOccurredHandler = (
                    error,
                    errorInfo
                ) => {
                    expect(typeof error).toBe('object');
                    expect(typeof errorInfo).toBe('object');

                    done();
                };

                render(
                    <ErrorBoundary
                        renderFallback={(error, errorInfo) => (
                            <ErrorInformation
                                error={error}
                                errorInfo={errorInfo}
                            />
                        )}
                        onErrorOccurred={onErrorOccurred}
                    >
                        <ComponentThatThrowsError />
                    </ErrorBoundary>
                );
            });
        });
    });

    describe('when no error is thrown in a child component', () => {
        it('should render the child components', () => {
            const ComponentThatDoesNotThrowError = () => <h1>Hello!</h1>;

            const { asFragment } = render(
                <ErrorBoundary
                    renderFallback={(error, errorInfo) => (
                        <ErrorInformation error={error} errorInfo={errorInfo} />
                    )}
                >
                    <ComponentThatDoesNotThrowError />
                </ErrorBoundary>
            );

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
