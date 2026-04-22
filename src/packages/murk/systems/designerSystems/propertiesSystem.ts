import { addEntity } from "../../../sanguine/entities/entities.js";
import { showEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { Rectangle } from "../../../sanguine/render/types.js";
import { getScreenSize } from "../../../sanguine/screen.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { AddPropertiesMessage } from "./types.js";

export const propertiesSystem = (
    messager: (message: Message) => void,
): System => {
    const panel = getPrefab('propertiesPanel').createEntity(0, 0);
    panel.renders ??= [];
    const [_, screenY] = getScreenSize();
    const rectangle: Rectangle = {
        color: 'dimgrey',
        height: screenY,
        width: 400,
        type: 'rectangle',
        x: 0,
        y: 0,
        z: 10,
        overlay: true,
    };
    panel.renders.push(rectangle);
    addEntity(panel);

    const startingY = 50;
    let y = startingY;
    const addProperty = (property: Entity) => {
        const entity = property;
        showEntity(entity, panel.visible);
        panel.children.push(entity);
    };

    return {
        triggers: [
            createTrigger<AddPropertiesMessage>('addProperties', message => {
                const { prefab } = message;
                const { components, shapes } = getPrefab(prefab);
                // add `prefab` to the top
                // addProperty()
                for (const component of components) {
                    const { type, entityId, ...properties } = component();
                    console.log(properties);
                    // add component type
                    // add property per field
                }

                if (!shapes) return;
                for (const render of shapes) {
                    // add render type
                    // add property per field
                }
            }),
        ],
        componentType: 'inkpad',
        process: (components: Component[], elapsedTime: number) => {

        },
    };
};
