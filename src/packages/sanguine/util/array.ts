export const sum = <T extends {}>(array: T[], getValue: (element: T) => number, defaultValue = 0) => {
    return array.reduce((curr, next) => curr + getValue(next), defaultValue);
}

export const repeat = (count: number, func: () => void) => {
    for (let i = 0; i < count; i++) {
        func();
    }
}