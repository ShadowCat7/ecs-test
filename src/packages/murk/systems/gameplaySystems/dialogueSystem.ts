import { addEntity } from "../../../sanguine/entities/entities.js";
import { assertMessage } from "../../../sanguine/messages.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { DialogueMessage } from "../messageTypes.js";

export const dialogueSystem = (
    messager: (message: Message) => void,
): System => {
    const fab = getPrefab('dialogue');
    const entity = fab.createEntity(0, 0);
    entity.visible = false;

    const speech = getPrefab('dialogueItem');

    addEntity(entity);

    return {
        triggers: [{
            messageType: 'dialogue',
            handler: (message: Message) => {
                assertMessage<DialogueMessage>(message, 'dialogue');
                const { dialogueId, } = message;

                const dialogue = "hi what's your name";
            }
        }],
        componentType: 'dialogue',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {

            }
        },
    };
};