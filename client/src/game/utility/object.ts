const createMap = <TKey, TValue>(array: TValue[], getKey: (element: TValue) => TKey) => {
    const map = new Map<TKey, TValue>(array.map(x => [getKey(x), x]));

    for (const item of array) {
        map.set(getKey(item), item);
    }

    return map;
}

const createMapWithValue = <TElement, TKey, TValue>(
    array: TElement[],
    getKey: (element: TElement) => TKey,
    getValue: (element: TElement) => TValue,
) => {
    const map = new Map<TKey, TValue>();

    for (const item of array) {
        map.set(getKey(item), getValue(item));
    }

    return map;
}