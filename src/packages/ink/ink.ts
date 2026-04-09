import { getValidDirectory } from '../sanguine/util/directory.js';

declare global { interface Window { inkjs: any; } }

const eachEntry = <T>(obj: Record<string, T> | undefined, action: (key: string, value: T) => void) => {
    if (obj === undefined) return;
    for (const [key, value] of Object.entries(obj))
        action(key, value);
};

export type LoadInkOptions = {
    variables?: Record<string, any>,
    observers?: Record<string, (name: string, newValue: any) => void>,
    externalFunctions?: Record<string, (name: string) => void>,
};

/**
 * 
 * @param sourceFile should be './data/filename.ink'
 */
export const loadInk = async (
    sourceFile: string,
    options: LoadInkOptions = {},
) => {
    const { variables, observers, externalFunctions } = options;
    const response = await fetch(getValidDirectory(sourceFile));
    const data = await response.json();
    const story = new window.inkjs.Story(data);
    eachEntry(variables, (k, v) => story.variablesState[k] = v);
    eachEntry(observers, (k, v) => story.ObserveVariable(k, v));
    eachEntry(externalFunctions, (k, v) => story.BindExternalFunction(k, v));
    return story;
};
