import { addEntity } from "../../../sanguine/entities/entities.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { getCurrentScene } from "../../../sanguine/sceneManager.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { DialogueMessage } from "../messageTypes.js";

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
                const dialogueMessage = message as DialogueMessage;
                const { dialogueId } = dialogueMessage;

                const dialogue = "hi what's your name"
            }
        }],
        componentType: 'dialogue',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {

            }
        },
    };
}