export const assertUnreachable = (x: never): never => {
    console.error(`default case reached for value ${x} in exhaustive switch cases`);
    debugger;
    return x;
}