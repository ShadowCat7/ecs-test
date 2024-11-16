import { Component, Entity } from "../types.js";
import { createEntity } from "./entity.js";

let entities: Entity[] = [];
let entitiesById = new Map<string, Entity>();
let componentMap = new Map<string, Component[]>();

export const addComponent = (component: Component) => {
    let list = componentMap.get(component.type) ?? [];

    if (!list.length) {
        componentMap.set(component.type, list);
    }

    list.push(component);
}

export const addEntity = (entity: Entity) => {
    entities.push(entity);
    entitiesById.set(entity.id, entity);
    for (const component of entity.components) {
        addComponent(component);
    }
}

export const getEntityList = () => entities;

export const getEntity = (id: string) => entitiesById.get(id)!;

const nullEntity = createEntity(0, 0);
let currentCamera: Entity | null = null;
export const getCamera = () => currentCamera ?? nullEntity;
export const setCamera = (camera: Entity) => { currentCamera = camera };

export const getComponents = (componentType: string) => componentMap.get(componentType);

export const resetEntities = () => {
    entities = [];
    entitiesById = new Map<string, Entity>();
    componentMap = new Map<string, Component[]>();
};

export const removeEntity = (id: string) => {
    entitiesById.delete(id);
    const index = entities.findIndex(x => x.id === id);
    const entity = entities[index];
    if (index < 0) return;
    entities.splice(index, 1);

    for (let component of entity.components) {
        const components = componentMap.get(component.type)!;
        const componentIndex = components.findIndex(x => x.entityId === component.entityId);
        if (componentIndex < 0) return;
        components.splice(componentIndex, 1);
    }
};

export const addEntities = (entities: Entity[]) => {
    for (const entity of entities) {
        addEntity(entity);
    }
};