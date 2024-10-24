export const assertUnreachable = (x: never): never => {
    debugger
    console.error(`default case reached for value ${x} in exhaustive switch cases`);
    return x;
}