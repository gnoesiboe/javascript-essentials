const consoleErrorFn = console.error;

global.disableErrorLog = () => (console.error = () => {});
global.enableErrorLog = () => (console.error = consoleErrorFn);
