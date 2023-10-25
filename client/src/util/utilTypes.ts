export type Dictionary<TKey extends string, TValue> = {
    [key in TKey]?: TValue
}