
export const sum = <T extends {}>(array: T[], getValue: (element: T) => number, defaultValue = 0) => {
    return array.reduce((curr, next) => curr + getValue(next), defaultValue);
};

export const repeat = (count: number, func: () => void) => {
    for (let i = 0; i < count; i++) {
        func();
    }
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

export const max = <T extends {}>(array: T[], maxFuncs: ((element: T) => number)[]) => {
    let maxes: number[] = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (!i) {
            maxes = maxFuncs.map(x => x(element));
            continue;
        }
        for (const maxFunc of maxFuncs) {
            const value = maxFunc(element);
            if (value > maxes[i]) maxes[i] = value;
        }
    }

    return maxes;
};