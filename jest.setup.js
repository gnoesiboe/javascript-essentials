const consoleErrorFn = console.error;

global.disableErrorLog = () => (console.error = () => {});
global.enableErrorLog = () => (console.error = consoleErrorFn);

// mock local storage to be able to test using it
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
    },
    writable: true,
});
