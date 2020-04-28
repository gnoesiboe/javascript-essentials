# @freshheads/javascript-essentials

A library containing javascript utilities that we until now often copy between projects and want to be make easier accessible.

## TOC

-   [Utilities](#Utilities)
    -   [Array](#array)
        -   [`createRangeArray`](#createrangearray)
        -   [`groupResultsByCallback`](#groupresultsbycallback)
        -   [`groupObjectArrayByObjectKey`](#groupobjectarraybyobjectkey)
    -   [String](#string-utilities)
        -   [`replacePlaceholdersInString`](#replaceplaceholdersinstring)
        -   [`truncatePreservingWords`](#truncatepreservingwords)
        -   [`createFullNameFromParts`](#createfullnamefromparts)
        -   [`removeLineBreaks`](#removelinebreaks)
    -   [Logger](#logger)
        -   [`createNamespacedLogger`](#createnamespacedlogger)
    -   [`RestartableTimeout`](#restartabletimeout)
    -   [`PromiseQueue`](#promisequeue)
-   [React](#react)
    -   [Components](#components)
        -   [`ErrorBoundary`](#errorboundary)
    -   [Hooks](#hooks)
        -   [`useStateWithRef`](#usestatewithref)
        -   [`useScrollToTopOnDependencyChange`](#usescrolltotopondependencychange)
-   [Storage](#storage)
    -   [`localStorage`](#localstorage)
    -   [`sessionStorage`](#sessionstorage)
-   [Cache](#cache)
    -   [`createInMemoryCache`](#createinmemorycache)

## Utilities

### Array

#### `createRangeArray`

Can be used to create an array with a range of numbers in it from the supplied `from` to the `until` value. Optionallly a `step` parameter can be supplied to control the steps taken between the `from` and `until` when generating the range.

Usage:

```javascript
import { createRangeArray } from '@freshheads/javascript-essentials/utilities/arrayUtilities';

createRangeArray(2, 7); // returns [2, 3, 4, 5, 6, 7]
createRangeArray(2, 7, 2); // returns [2, 4, 6]
```

#### `groupResultsByCallback`

Takes an array and groups the items in it by looping through it and resolving the group key for it.

Usage:

```typescript
import { groupResultsByCallback } from '@freshheads/javascript-essentials/utilities/arrayUtilities';

type ItemType = { title: string; type: string };

const items: Array<ItemType> = [
    {
        title: 'Some title',
        type: 'blogpost',
    },
    {
        title: 'Other title',
        type: 'blogpost',
    },
    {
        title: 'Another value',
        type: 'newsArticle',
    },
];

const result = groupResultsByCallback<ItemType>(items, (item) => item.type);

// Output:
//
// [
//     blogpost: [
//         {
//              title: 'Some title',
//              type: 'blogpost',
//         },
//         {
//             title: 'Other title',
//             type: 'blogpost',
//         }
//     ],
//     newsArticle: [
//         {
//             title: 'Another value',
//             type: 'newsArticle',
//         }
//     ]
// ]
```

#### `groupObjectArrayByObjectKey`

Takes an array of objects and sorts it by grouping objects that have the same key value. If the key is not present in one of the items, it is added to the 'other' category.

Usage:

```typescript
import { groupObjectArrayByObjectKey } from '@freshheads/javascript-essentials/utilities/arrayUtilities';

type ItemType = { title: string; type?: string };

const items: Array<ItemType> = [
    {
        title: 'Some title',
        type: 'blogpost',
    },
    {
        title: 'Other title',
        type: 'blogpost',
    },
    {
        title: 'Another something',
    },
];

const result = groupObjectArrayByObjectKey<ItemType>(items, 'type');

// Output:
//
// [
//     blogpost: [
//         {
//              title: 'Some title',
//              type: 'blogpost',
//         },
//         {
//             title: 'Other title',
//             type: 'blogpost',
//         }
//     ],
//     other: [
//         {
//             title: 'Another value',
//             type: 'newsArticle',
//         }
//     ]
// ]
```

### String

#### `replacePlaceholdersInString`

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

#### `truncatePreservingWords`

Truncates a string, but makes sure that individual words are not cut-off somewhere in the middle.

Usage:

```typescript
// output = 'some short…'
const truncatedString = truncatePreservingWords('some short string', 14);
```

#### `createFullNameFromParts`

Takes parts of a name and creates a full name out of it.

Usage:

```typescript
import { createFullNameFromParts } from '@freshheads/javascript-essentials/utilities/stringUtilities';

// Output: 'Peter van der Sanden'
createFullNameFromParts('Peter', 'van der', 'Sanden');

// Output: 'Peter Jansen'
createFullNameFromParts('Peter', null, 'Jansen');
```

#### `removeLineBreaks`

Removes line breaks from a string and replaces them with something else.

Usage:

```typescript
import { removeLineBreaks } from '@freshheads/javascript-essentials/utilities/stringUtilities';

// Output: 'Eerste regel. Tweede regel'
removeLineBreaks('Eerste regel\\r\\nTweede regel', '. ');
```

### Logger

#### `createNamespacedLogger`

Creates a logger that prefixes every log that is send to it with a specific key. This makes easier to scan for logs in the console. If used with namespace `security` for instance, it logs: `[SECURITY] other stuff you logged`.

Usage:

```javascript
const logger = createNamespacedLogger('security');

const credentials = ['ROLE_USER', 'ROLE_ADMIN'];

// should output [SECURITY] credentials ['ROLE_USER', 'ROLE_ADMIN'] in the consolecreate
logger.info(credentials, 'credentials', credentials);
```

### `RestartableTimeout`

A restartable timeout with a clear interface, that allows for callback chaining (and stopping the chain at any time).

Usage:

```typescript
import RestartableTimeout from '@freshheads/javascript-essentials/utilities/RestartableTimeout';

const timeout = new RestartableTimeout(1000); // 1 second timeout

timeout.addCallback(() => {
    // do something, executed second
});

timeout.addCallback((next) => {
    // do something, executed first

    next(); // calls the previous callback (and can be ommited if required)
});

timeout.start();
timeout.restart();()
timeout.stopAndReset();
```

### PromiseQueue

Sometimes promises need to be executed one after another. For instance when you want a set of API requests to be executed one after another, to ensure that the order of the responses is not dependent on the response times of the requested API's endpoints.

Usage:

```typescript
import RequestQueue from '@freshheads/javascript-essentials/utilities/PromiseQueue';

const queue = new PromiseQueue();

queue
    .add<ResponseType>(() => { // execute some ajax request })
    .then((response) => {
        // handle response from the API
    })
    .catch(error => {
        // handle any error
    });

queue
    .add<SecondResponseType>(() => { // execute some ajax request })
    .then((response) => {
        // handle response from the API
    })
    .catch(error => {
        // handle any error
    });

// further utility functions:
queue.length; // returns the current length of the queue
queue.started; // returns true if started

```

## React

### Components

#### `ErrorBoundary`

Re-usable `ErrorBoundary` for React projects. Catches uncaught errors in child components, and displays the fallback component instead. An error listener can also be supplied to use for instance when you want to log the error.

Usage:

```javascript
import { ErrorBoundary } from '@freshheads/javascript-essentials/react/components/ErrorBoundary';

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

### Hooks

#### `useStateWithRef`

Useful as an fix for [stale callbacks](https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function). It's a hook that syncs a state and a ref internally, so that we are always able to access the latest version of a state through the ref, but still have the state to cause re-render as expected.

Usage:

```typescript
import useStateWithRef from '@freshheads/javascript-essentials/react/hooks/useStateWithRef';

const myComponent: Reat.FC = () => {
    // Can be used pretty much like `getState()` except `getState` is a function
    const { getState, setState } = useStateWithRef<number>(0);
};
```

#### `useScrollToTopOnDependencyChange`

Scrolls to top when one of the supplied dependencies changes. Can be used for instance in combination with location. If no arguments are supplied, the hook only scrolls to top on mount.

Usage:

```typescript
import useStateWithRef from '@freshheads/javascript-essentials/react/hooks/useScrollToTopOnDependencyChange';

const location = useLocation(); // react-router-dom

useScrollToTopOnDependencyChange(location.pathname, location.search);
```

## Routing

### `createPathFromRoute`

See [`replacePlaceholdersInString`](#replaceplaceholdersinstring).

Usage:

```typescript
import { createPathFromRoute } from '@freshheads/javascript-essentials/routing/createPathFromRoute'

// outputs: /blog/post/3/my-blog-post-something
const path = createPathFromRoute('/blog/post/:id/:slug', {
    ':id': 3,
    ':slug': 'my-blog-post-something
});
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

```typescript
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

## Cache

### `createInMemoryCache`

Factory method to create an in memory cache for values of any type. This cache is cleared with every request, and therefor mostly usable in client-side development. It also expires cache after some time, if required.

Usage:

```typescript
const entriesExpireInSeconds = 60; // 1 minute

const cache = createInMemoryCache<string>(
    'yourNamespace',
    entriesExpireInSeconds
);

// store values in cache
cache.set('someKey', 'some value');

// retrieve values from cache
const value = cache.get('someKey');

// if the cache does not contain the value, create a new value and return
// that, to be able to get and create in one command
const value = cache.getOrCreate('someKey', async () => {
    const response = await axios.get('/some-path');

    return response.data.someValue;
});

// removes a specific key
cache.remove('someKey');

// clears entire cache within this namespace
cache.clear();

// counts number of keys in cache
cache.count();
```

# Todo

-   [hexToRgbConverter](https://github.com/freshheads/013/blob/develop/assets/frontend/src/js/utility/colorUtility.ts)
-   [Money formatting](https://github.com/freshheads/013/blob/develop/assets/frontend/src/js/utility/numberUtilities.ts)
-   [Tracking utilities](https://github.com/freshheads/013/blob/develop/assets/frontend/src/js/utility/trackingUtilities.ts) (misschien ook HOC oid. `withTrackingOnClick` oid.? Of een hook?)
-   [Routing: extract path with placeholders](https://github.com/freshheads/013/blob/develop/assets/frontend/src/js/routing/utility/urlGenerator.ts#L13)
-   [Group object array preserving order](https://github.com/freshheads/freshheads-data-2.0/blob/develop/assets/frontend/src/js/components/blueprintPeriodResultOverview/utilities/resultSortingUtilities.ts)
