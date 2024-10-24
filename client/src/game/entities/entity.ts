import { Component, EntityData, EntityDrawOptions, EntityUpdateOptions } from "./types.js";

export type CreateEntityOptions<T extends EntityData> = {
    data: T,
    components: Component<T>[],
}

export const createEntity = <T extends EntityData>(options: CreateEntityOptions<T>) => {
    const {
        components,
        data: initialData,
    } = options;

    const data = {
        ...initialData,
        id: Symbol(),
    };

    for (let component of components) {
        if (component.start)
            component.start(data);
    }

    return {
        getData: () => data,
        draw: (options: EntityDrawOptions) => {
            for (let component of components) {
                component.draw(data, options);
            }
        },
        update: (options: EntityUpdateOptions) => {
            for (let component of components) {
                component.update(data, options);
            }
        }
    }
}