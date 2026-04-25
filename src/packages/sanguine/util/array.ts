
export const sum = <T extends {}>(array: T[], getValue: (element: T) => number, defaultValue = 0) => {
    return array.reduce((curr, next) => curr + getValue(next), defaultValue);
};

export const repeat = (count: number, func: () => void) => {
    for (let i = 0; i < count; i++) {
        func();
    }
};

export const createMap = <T extends {}>(array: T[], getKey: (element: T) => string) => {
    const map = new Map<string, T>();

    for (let element of array) {
        map.set(getKey(element), element);
    }

    return map;
};

export const groupMap = <T extends {}>(array: T[], getKey: (element: T) => string) => {
    const map = new Map<string, T[]>();

    for (let element of array) {
        const key = getKey(element);
        const group = map.get(key);

        if (!group) {
            map.set(key, [element]);
        } else {
            group.push(element);
        }
    }

    return map;
};

export const max = <T extends {}>(array: T[], getValue: (element: T) => number) => {
    if (array[0] === undefined) return undefined;
    let max = getValue(array[0]);
    for (const element of array) {
        const value = getValue(element);
        if (value > max) return max;
    }
    return max;
};

export const extendArray = <T>(array: T[], newLength: number, defaultValue: T) => {
    repeat(newLength - array.length, () => array.push(defaultValue));
    return array;
};
