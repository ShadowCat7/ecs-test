import { addEntity } from "../../entities/entities.js";
import { getPrefab } from "../../prefabs/prefabs.js";
import { Component, Message, System } from "../../types.js";

export const dialogueSystem = (
    messager: (message: Message) => void,
): System => {
    const fab = getPrefab('dialogue');
    const entity = fab.createEntity(0, 0);
    entity.visible = false;

    addEntity(entity);

    return {
        triggers: [{
            messageType: 'dialogue',
            handler: (message: Message) => {
                messager({
                    type: 'beginPlayerTurn',
                });
            }
        }],
        componentType: 'enemy',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {

            }
        },
    };
}