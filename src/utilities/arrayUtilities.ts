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

type GroupedResults<T> = {
    [key: string]: Array<T>;
};

export function groupResultsByCallback<T>(
    items: Array<T>,
    callback: (item: T) => string
): GroupedResults<T> {
    const grouped: GroupedResults<T> = {};

    items.forEach((item) => {
        const value = callback(item);

        if (typeof grouped[value] === 'undefined') {
            grouped[value] = [];
        }

        grouped[value].push(item);
    });

    return grouped;
}

export function groupObjectArrayByObjectKey<T extends { [key: string]: any }>(
    items: Array<T>,
    key: string
): GroupedResults<T> {
    return groupResultsByCallback<T>(items, (item: T) => {
        return item[key] || 'other';
    });
}
