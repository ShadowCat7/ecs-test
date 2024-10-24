export const nextInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export const randomItem = <T>(items: T[]) => {
    return items[nextInt(items.length)];
}