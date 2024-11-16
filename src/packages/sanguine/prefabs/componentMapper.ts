import { Component } from "../types.js";
import { createAsyncCache } from "../util/cache.js";
import { getValidDirectory } from "../util/directory.js";

let componentsDirectory = './nonexistent/';
export const setComponentsDirectory = (directory: string) => {
    componentsDirectory = getValidDirectory(directory);
    if (!componentsDirectory.endsWith('/')) {
        componentsDirectory += '/';
    }
}

const componentFilenameTester = /^[A-Za-z/]+$/;

const getComponentFromFile = async (type: string) => {
    if (!componentFilenameTester.test(type)) {
        throw new Error(`invalid component name ${type}`);
    }

    let component;

    try {
        component = await import(`../../${componentsDirectory}${type}Component.js`);
    } catch {
        throw new Error(`unable to find component ${type}Component.js`);
    }

    const key = Object.keys(component)[0];
    
    return component[key];
}

export const getComponent = createAsyncCache<(data: any) => Component>(getComponentFromFile);