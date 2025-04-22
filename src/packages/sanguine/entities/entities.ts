import { CameraComponent } from "../../castle/components/cameraComponent.js";
import { Component, Entity } from "../types.js";
import { createQuadtree } from "../util/quadtree.js";

let entities: Entity[] = [];
let entitiesById = new Map<string, Entity>();
let componentMap = new Map<string, Component[]>();
let quadtree = createQuadtree<Entity>([]);

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
    // quadtree.addNode(entity);
    for (const component of entity.components) {
        addComponent(component);
    }
}

export const getEntityList = () => entities;

export const getEntityQuadtree = () => quadtree;

export const getEntity = (id: string) => entitiesById.get(id)!;

export const getCamera = () => {
    const cameras = componentMap.get('camera');
    if (!cameras) throw new Error('No active camera');

    const camera = (cameras as CameraComponent[]);//.filter(x => x.active);

    if (camera.length !== 1) throw new Error('Too many active cameras')

    const cameraEntity = getEntity(camera[0].entityId);

    return cameraEntity;
}

export const getComponents = <T extends Component>(componentType: string) => componentMap.get(componentType) as T[] | undefined;

export const resetEntities = () => {
    entities = [];
    entitiesById = new Map<string, Entity>();
    componentMap = new Map<string, Component[]>();
    quadtree = createQuadtree<Entity>([]);
};

export const removeEntity = (id: string) => {
    const entity = entitiesById.get(id);
    if (!entity) return;
    entitiesById.delete(id);
    quadtree.removeItem(entity);
    const index = entities.findIndex(x => x.id === id);
    if (index >= 0)
        entities.splice(index, 1);

    for (let component of entity.components) {
        const components = componentMap.get(component.type)!;
        const componentIndex = components.findIndex(x => x.entityId === component.entityId);
        if (componentIndex >= 0)
            components.splice(componentIndex, 1);
    }
};

export const addEntities = (entities: Entity[]) => {
    for (const entity of entities) {
        addEntity(entity);
    }
};