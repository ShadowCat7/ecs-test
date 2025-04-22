import { DrawOptions } from "../draw/types.js";
import { Render } from "../render/types.js";
import { Component, Entity, Prefab } from "../types.js";

export type CreateEntityOptions = {
    id?: string,
    components?: Component[],
    data?: {
        x?: number,
        y?: number,
    },
    render: (entity: Entity, options: DrawOptions) => void,
}

const getComponents = (prefab: Prefab, components: Component[]) => {
    components.push(...prefab.components.map(x => x()));

    if (!prefab.prefabs?.length) return;

    for (const p of prefab.prefabs) {
        getComponents(p, components);
    }
}

export const createEntity = (x: number, y: number, prefab?: Prefab, renders?: Render[]) => {
    const id = Math.random().toString().substring(2);

    const components: Component[] = [];
    const componentsByType = new Map<string, Component>();

    const entity: Entity = {
        x,
        y,
        rotation: 0,
        scale: 1,
        id,
        visible: true,
        components,
        renders,
        prefab,
        getComponent: <T extends Component>(type: string) => componentsByType.get(type) as T | undefined,
        addComponent: (component: Component) => {
            component.entityId = id;
            components.push(component);
            componentsByType.set(component.type, component);
        },
    };

    if (prefab)
        getComponents(prefab, components);

    for (let component of components) {
        component.entityId = id;
        componentsByType.set(component.type, component);
    }

    return entity;
}