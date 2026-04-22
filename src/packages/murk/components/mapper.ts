const componentFilenameTester = /^[A-Za-z/]+$/;

export const loadComponent = async (type: string) => {
    if (!componentFilenameTester.test(type)) {
        throw new Error(`invalid component name ${type}`);
    }

    let component;

    try {
        component = await import(`./${type}Component.js`);
    } catch {
        throw new Error(`unable to find component ${type}Component.js`);
    }

    const key = Object.keys(component)[0];

    return component[key];
}
