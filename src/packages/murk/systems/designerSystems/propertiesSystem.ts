import { addEntity } from "../../../sanguine/entities/entities.js";
import { showEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { Rectangle, Text } from "../../../sanguine/render/types.js";
import { getScreenSize } from "../../../sanguine/screen.js";
import { createTrigger } from "../../../sanguine/system.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { capitalize } from "../../../sanguine/util/string.js";
import { ContainerAddMessage } from "../messageTypes.js";
import { AddPropertiesMessage } from "./types.js";

const getContainerAddMessage = (containerId: string, entityId: string): ContainerAddMessage => {
    return {
        type: 'containerAdd',
        containerId,
        entityId,
    };
};

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
        z: 0,
        overlay: true,
    };
    panel.renders.push(rectangle);
    addEntity(panel);

    const textFab = getPrefab('text');
    const addNewText = (text: string) => {
        const entity = textFab.createEntity(0, 0);
        const render = entity.renders?.find(x => x.type === 'text');
        if (!render) throw new Error('Prefab "text" doesn\'t have a text render.');
        render.text = text;
        addEntity(entity);
        const containerAddMessage = getContainerAddMessage(panel.id, entity.id);
        messager(containerAddMessage);
        return entity;
    };

    const textboxFab = getPrefab('textbox');
    const addNewProperty = (name: string) => {
        const entity = textboxFab.createEntity(0, 0);
        // prefill data into text
        const render = entity.renders?.find(x => x.type === 'text');
        if (!render) throw new Error('Prefab "textbox" doesn\'t have a text render.');
        // render.text = text;
        addEntity(entity);
        const containerAddMessage = getContainerAddMessage(panel.id, entity.id);
        messager(containerAddMessage);
        return entity;
    };

    return {
        triggers: [
            createTrigger<AddPropertiesMessage>('addProperties', message => {
                const { prefab } = message;
                const { components, shapes } = getPrefab(prefab);
                addNewText(capitalize(prefab) + ' prefab');

                // entity x and y

                for (const component of components) {
                    const { type, entityId, ...properties } = component();

                    const propertiesList = Object.entries(properties);
                    if (!propertiesList.length) continue;

                    addNewText(capitalize(type) + 'Component:');
                    for (const [key, value] of propertiesList) {
                        addNewText(key);
                        addNewProperty('');
                    }

                    console.log(properties);
                }

                if (!shapes) return;
            }),
        ],
        componentType: null,
        process: (components: Component[], elapsedTime: number) => {

        },
    };
};
