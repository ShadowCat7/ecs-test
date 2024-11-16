type KeyValueMap = { [key: string]: string };

export const keyValueSwitch = (obj: KeyValueMap) => {
    const newObj: KeyValueMap = {};

    for (const [key, value] of Object.entries(obj)) {
        newObj[value] = key;
    }

    return newObj;
}