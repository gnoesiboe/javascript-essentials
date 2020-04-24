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
