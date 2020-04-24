# @freshheads/javascript-essentials

A library containing javascript utilities that we until now often copy between projects and want to be make easier accessible.

## Array utilities

### `createRangeArray`

Can be used to create an array with a range of numbers in it from the supplied `from` to the `until` value. Optionallly a `step` parameter can be supplied to control the steps taken between the `from` and `until` when generating the range.

Usage:

```javascript
import { createRangeArray } from '@freshheads/javascript-essentials/utilities/arrayUtilities';

createRangeArray(2, 7); // returns [2, 3, 4, 5, 6, 7]
createRangeArray(2, 7, 2); // returns [2, 4, 6]
```

## String utilities

### `replacePlaceholdersInString`

Takes a string with placeholders and it's replacements and returns a new string with the placeholders replaced. Placeholder replacements can be string, numbers or callback functions returning a string or a number.

Usage:

```javascript
import { replacePlaceholdersInString } from '@freshheads/javascript-essentials/utilities/stringUtilities';

const first = 1;
const second = '3';

const output = replacePlaceholdersInString('{first} + {second} = {outcome}', {
    '{first}': first,
    '{second}': second,
    '{outcome}': () => first + parseInt(second),
});

// returns: '1 + 3 = 4''
```

## Logger

### `createNamespacedLogger`

Creates a logger that prefixes every log that is send to it with a specific key. This makes easier to scan for logs in the console. If used with namespace `security` for instance, it logs: `[SECURITY] other stuff you logged`.

Usage:

```javascript
const logger = createNamespacedLogger('security');

const credentials = ['ROLE_USER', 'ROLE_ADMIN'];

// should output [SECURITY] credentials ['ROLE_USER', 'ROLE_ADMIN'] in the console
logger.info(credentials, 'credentials', credentials);
```

## React

### `ErrorBoundary`

Re-usable `ErrorBoundary` for React projects. Catches uncaught errors in child components, and displays the fallback component instead. An error listener can also be supplied to use for instance when you want to log the error.

Usage:

```javascript
import { ErrorBoundary } from '@freshheads/javascript-essentials/react/errorHandling/components/ErrorBoundary';

const YourApp = () => {
    const onErrorOccurred: OnErrorOccurredHandler = (error, errorInfo) =>
        pushErrorToSomeCentralLoggingSystem(error, errorInfo);

    return (
        <ErrorBoundary
            renderFallback={(error, errorInfo) => (
                <YourCustomErrorInformationDisplay
                    error={error}
                    errorInfo={errorInfo}
                />
            )}
            onErrorOccurred={onErrorOccurred}
        >
            <SomeComponentThatMightThrowAnError />
        </ErrorBoundary>
    );
};
```

## Storage

### `localStorage`

Even though `localStorage` has a pretty streightforward browser API, we find ourselves wrapping it in an abstraction a lot. We do this to catch errors that sometimes occur when for instance:

-   the storage is full
-   the browser security settings don't allow for local storage
-   the browser support is limited or different

The localStorage abstraction in this library catches errors if wanted and makes it possible for you to log it if the case.

Also it allows for easier retrieval of specific types, like `int` and `boolean`, as by default everything is stored and retrieved as `string`.

Usage:

```javascript
import {
    get,
    write,
} from '@freshheads/javascript-essentials/storage/localStorage';

// basic usage
const success = write('key', 2912);
const value = getInt('key', -1);

// with error logging
const success = write('key', 2912, true, (error) =>
    writeErrorToLoggingSystem(error)
);
const value = getInt('key', -1, true, (error) =>
    writeErrorToLoggingSystem(error)
);
```

### `sessionStorage`

See `localStorage` above but for `sessionStorage`.
