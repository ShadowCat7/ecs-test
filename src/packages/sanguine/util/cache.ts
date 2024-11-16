export const createCache = <T>(create: (type: string) => T) => {
    const cache: { [key: string]: T } = {};

    return (type: string) => {
        const cached = cache[type];
        if (cached) return cached;
        const value = create(type);
        cache[type] = value;
        return value;
    }
}

export const createAsyncCache = <T>(create: (type: string) => Promise<T>) => {
    const cache: { [key: string]: T } = {};

    return async (type: string) => {
        const cached = cache[type];
        if (cached) return cached;
        const value = create(type);
        cache[type] = await value;
        return value;
    }
}