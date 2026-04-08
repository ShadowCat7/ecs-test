import { addEntity, getEntity } from "../../../sanguine/entities/entities.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { addItemToGrid } from "../../data/grid.js";

export const gridSystem = (
    messager: (message: Message) => void,
): System => {
    const fab = getPrefab('grid');
    const entity = fab.createEntity(0, 0);

    addEntity(entity);

    return {
        componentType: 'gridItem',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {
                const entity = getEntity(component.entityId);
                addItemToGrid(entity);
            }
        },
    };
}