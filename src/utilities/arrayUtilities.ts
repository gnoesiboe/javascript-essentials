export function createRangeArray(
    from: number,
    until: number,
    step: number = 1
): number[] {
    if (from > until) {
        throw new Error(
            'The until value should be higher or the same as the until value'
        );
    }

    const rangeArray = [];

    for (let i = from; i <= until; i += step) {
        rangeArray.push(i);
    }

    return rangeArray;
}
